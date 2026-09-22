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

        logger.info("Initializing DataSource with JDBC URL: {}", finalJdbcUrl);

        HikariConfig hikariConfig = new HikariConfig();
        hikariConfig.setJdbcUrl(finalJdbcUrl);
        hikariConfig.setUsername(username);
        hikariConfig.setPassword(password);
        hikariConfig.setDriverClassName(driverClassName);

        // Connection pool optimization for cloud hosts (e.g. Render free tier)
        hikariConfig.setMaximumPoolSize(10);
        hikariConfig.setMinimumIdle(2);
        hikariConfig.setIdleTimeout(300000);
        hikariConfig.setConnectionTimeout(20000);
        hikariConfig.setMaxLifetime(1200000);

        return new HikariDataSource(hikariConfig);
    }
}
