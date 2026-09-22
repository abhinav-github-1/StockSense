package com.stocksense.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URISyntaxException;
import java.sql.Connection;

@Configuration
public class DatabaseConfig {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseConfig.class);

    @Value("${spring.datasource.url:}")
    private String configuredUrl;

    @Value("${spring.datasource.username:postgres}")
    private String configuredUsername;

    @Value("${spring.datasource.password:}")
    private String configuredPassword;

    @Value("${spring.datasource.driver-class-name:org.postgresql.Driver}")
    private String driverClassName;

    @Bean
    @Primary
    public DataSource dataSource() {
        String dbUrl = System.getenv("SPRING_DATASOURCE_URL");
        if (dbUrl == null || dbUrl.isBlank()) {
            dbUrl = System.getenv("DATABASE_URL");
        }
        if (dbUrl == null || dbUrl.isBlank()) {
            dbUrl = System.getenv("INTERNAL_DATABASE_URL");
        }
        if (dbUrl == null || dbUrl.isBlank()) {
            dbUrl = configuredUrl;
        }

        String username = System.getenv("DB_USERNAME");
        if (username == null || username.isBlank()) {
            username = configuredUsername;
        }

        String password = System.getenv("DB_PASSWORD");
        if (password == null || password.isBlank()) {
            password = configuredPassword;
        }

        String finalJdbcUrl = dbUrl;

        // Convert postgres:// or postgresql:// (from Render / Supabase / Neon) to jdbc:postgresql://
        if (dbUrl != null && (dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://"))) {
            try {
                String cleanUrl = dbUrl.startsWith("postgres://") 
                        ? dbUrl.replaceFirst("postgres://", "http://") 
                        : dbUrl.replaceFirst("postgresql://", "http://");
                
                URI uri = new URI(cleanUrl);

                if (uri.getUserInfo() != null) {
                    String[] userInfo = uri.getUserInfo().split(":");
                    if (userInfo.length > 0 && (username == null || username.isBlank() || username.equals("postgres"))) {
                        username = userInfo[0];
                    }
                    if (userInfo.length > 1 && (password == null || password.isBlank())) {
                        password = userInfo[1];
                    }
                }

                String host = uri.getHost();
                int port = uri.getPort() > 0 ? uri.getPort() : 5432;
                String path = uri.getPath();

                finalJdbcUrl = "jdbc:postgresql://" + host + ":" + port + path + "?sslmode=prefer";
                logger.info("Parsed DATABASE_URL into JDBC format: jdbc:postgresql://{}:{}{}", host, port, path);
            } catch (URISyntaxException e) {
                logger.error("Failed to parse DATABASE_URL: {}", dbUrl, e);
            }
        }

        if (finalJdbcUrl == null || finalJdbcUrl.isBlank()) {
            String dbHost = System.getenv("DB_HOST");
            if (dbHost == null || dbHost.isBlank()) dbHost = "localhost";
            String dbPort = System.getenv("DB_PORT");
            if (dbPort == null || dbPort.isBlank()) dbPort = "5432";
            String dbName = System.getenv("DB_NAME");
            if (dbName == null || dbName.isBlank()) dbName = "stocksense";

            finalJdbcUrl = "jdbc:postgresql://" + dbHost + ":" + dbPort + "/" + dbName + "?sslmode=prefer";
        }

        logger.info("Target DataSource JDBC URL: {}", finalJdbcUrl);

        // Attempt PostgreSQL connection
        try {
            HikariConfig hikariConfig = createHikariConfig(finalJdbcUrl, username, password, driverClassName);
            HikariDataSource pgDataSource = new HikariDataSource(hikariConfig);
            
            // Validate connection with 3-second timeout
            try (Connection conn = pgDataSource.getConnection()) {
                if (conn.isValid(3)) {
                    logger.info("Successfully connected to PostgreSQL database!");
                    return pgDataSource;
                }
            } catch (Exception connEx) {
                logger.warn("PostgreSQL connection validation failed: {}. Closing pool...", connEx.getMessage());
                pgDataSource.close();
            }
        } catch (Exception e) {
            logger.warn("Could not initialize PostgreSQL DataSource: {}.", e.getMessage());
        }

        // Fallback to H2 In-Memory Database if PostgreSQL connection failed or database suspended by Render
        logger.warn("--------------------------------------------------------------------------------");
        logger.warn("FALLBACK: PostgreSQL DB is unavailable/suspended. Initializing H2 In-Memory DB.");
        logger.warn("--------------------------------------------------------------------------------");

        HikariConfig h2Config = new HikariConfig();
        h2Config.setJdbcUrl("jdbc:h2:mem:stocksense;MODE=PostgreSQL;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE;CASE_INSENSITIVE_IDENTIFIERS=TRUE");
        h2Config.setUsername("sa");
        h2Config.setPassword("");
        h2Config.setDriverClassName("org.h2.Driver");
        h2Config.setMaximumPoolSize(10);
        h2Config.setMinimumIdle(2);

        return new HikariDataSource(h2Config);
    }

    private HikariConfig createHikariConfig(String jdbcUrl, String username, String password, String driverClass) {
        HikariConfig hikariConfig = new HikariConfig();
        hikariConfig.setJdbcUrl(jdbcUrl);
        hikariConfig.setUsername(username);
        hikariConfig.setPassword(password);
        hikariConfig.setDriverClassName(driverClass);
        hikariConfig.setMaximumPoolSize(10);
        hikariConfig.setMinimumIdle(2);
        hikariConfig.setIdleTimeout(300000);
        hikariConfig.setConnectionTimeout(5000); // 5 sec connection timeout
        hikariConfig.setInitializationFailTimeout(5000L);
        hikariConfig.setMaxLifetime(1200000);
        return hikariConfig;
    }
}
