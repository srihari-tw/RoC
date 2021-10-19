FROM openjdk:8-jdk-alpine

ADD target/app/BOOT-INF/lib /app/lib

ADD target/app/META-INF /app/META-INF

# This comes at last since every time you change the source code it changes the classes. 
ADD target/app/BOOT-INF/classes /app

EXPOSE 8080

ENTRYPOINT [ "java", "-cp", "app:app/lib/*", "org.boot.services.metadata.Application" ]