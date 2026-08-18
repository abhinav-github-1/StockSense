# Stage 1: Build Java Spring Boot Application
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Cache Maven dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and build executable JAR
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Production JRE Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy built JAR from stage 1
COPY --from=build /app/target/stocksense-backend-*.jar app.jar

# Expose Render PORT
EXPOSE 8083
ENV PORT=8083

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
