FROM gradle:8.10.2-jdk21 AS build
WORKDIR /workspace
COPY app/settings.gradle app/build.gradle app/
COPY app/src app/src
WORKDIR /workspace/app
RUN gradle --no-daemon bootJar

FROM eclipse-temurin:21-jre
WORKDIR /app
RUN useradd --system --uid 10001 appuser
COPY --from=build /workspace/app/build/libs/*.jar app.jar
USER appuser
EXPOSE 8080
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75", "-jar", "/app/app.jar"]
