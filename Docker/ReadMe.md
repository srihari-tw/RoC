# The Rise of Containers

## Docker Introduction

`docker version`

```
Client:
 Cloud integration: 1.0.17
 Version:           20.10.8
 API version:       1.41
 Go version:        go1.16.6
 Git commit:        3967b7d
 Built:             Fri Jul 30 19:55:20 2021
 OS/Arch:           darwin/amd64
 Context:           default
 Experimental:      true

Server: Docker Engine - Community
 Engine:
  Version:          20.10.8
  API version:      1.41 (minimum version 1.12)
  Go version:       go1.16.6
  Git commit:       75249d8
  Built:            Fri Jul 30 19:52:10 2021
  OS/Arch:          linux/amd64
  Experimental:     false
 containerd:
  Version:          1.4.9
  GitCommit:        e25210fe30a0a703442421b0f60afac609f950a3
 runc:
  Version:          1.0.1
  GitCommit:        v1.0.1-0-g4144b63
 docker-init:
  Version:          0.19.0
  GitCommit:        de40ad0
```

`docker images`
```
REPOSITORY                    TAG       IMAGE ID       CREATED       SIZE
gcr.io/k8s-minikube/kicbase   v0.0.27   9fa1cc16ad6d   2 weeks ago   1.08GB
```

`docker pull nginx`
```
Using default tag: latest
latest: Pulling from library/nginx
07aded7c29c6: Pull complete
bbe0b7acc89c: Pull complete
44ac32b0bba8: Pull complete
91d6e3e593db: Pull complete
8700267f2376: Pull complete
4ce73aa6e9b0: Pull complete
Digest: sha256:765e51caa9e739220d59c7f7a75508e77361b441dccf128483b7f5cce8306652
Status: Downloaded newer image for nginx:latest
docker.io/library/nginx:latest
```

`docker pull hello-world`
```
Using default tag: latest
latest: Pulling from library/hello-world
2db29710123e: Pull complete
Digest: sha256:9ade9cc2e26189a19c2e8854b9c8f1e14829b51c55a630ee675a5a9540ef6ccf
Status: Downloaded newer image for hello-world:latest
docker.io/library/hello-world:latest
```

`docker images`
```
REPOSITORY                    TAG       IMAGE ID       CREATED       SIZE
nginx                         latest    f8f4ffc8092c   3 days ago    133MB
hello-world                   latest    feb5d9fea6a5   8 days ago    13.3kB
gcr.io/k8s-minikube/kicbase   v0.0.27   9fa1cc16ad6d   2 weeks ago   1.08GB
```

`docker ps`

```
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```

`docker run hello-world`

```
Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/
```

`docker ps -a`

```
CONTAINER ID   IMAGE                                 COMMAND                  CREATED         STATUS                     PORTS     NAMES
80e176b9f332   hello-world                           "/hello"                 2 minutes ago   Exited (0) 2 minutes ago             boring_yalow
```

`docker run nginx`

`docker run -d nginx`

`docker logs <container_id>`

`watch docker ps` <Keeps a continuous watch on the containers' status>

`docker exec -it myweb sh`

Multiple containers can be launched and you can verify by hitting different endpoints. http://localhost:80 with port forwarding from nginx to 80 in one container and http://localhost:81 with port forwarding from nginx to 81 in another container.

`docker run -p 81:80 --name myweb1 -d nginx` - `-d` runs it in detached mode. This runs another container instance of nginx image.

Once done, access the nginx server to see the results.

E.g. the following command writes a html file with the heading element.

`docker exec -it myweb1 sh` This opens the interactive shell to work in the container instance.

`echo "<h1>Hello from Container</h1>" > test.html` writes the content to the html file.

Copy the html / create an html in the folder `usr/share/nginx/html`.

The container can have more than one process - to determine which is the main process, we do run another container and check it out.

`docker run -it busybox sh` - runs the busybox in a container and opens the shell.

In the shell we can run the `ps` command to find the list of processes.

```
/ # ps
PID   USER     TIME  COMMAND
    1 root      0:00 sh
    7 root      0:00 ps
/ #
```

Process id 1 is sh. It is the main process, it if dies/exits the container.

To remove the container

`docker rm <container name or id>`

> Exercise 1 - Running nginx and use the volume mount feature of Docker to retain data on the www folder.

> `mkdir -p /tmp/nginx/html`

> `docker run -t -d -p 8080:80 -v /tmp/nginx/html:/usr/share/nginx/html:ro --name nginx-example nginx`

> Create a new file `index.html` with some content and copy it to `/tmp/nginx/html`. Visit http://localhost:8080 to view the content served. Change the content of the file in your local drive and you see the container's volume getting updated and the new content served in the same URL. `:ro` denotes readonly.

## Docker Images

* An image is an inert, immutable, file that's essentially a snapshot of a container.  
* Container is an instance of a Docker Image. 
* Images are stored in a Docker registry such as registry.hub.docker.com and also cached by container engine on host.

### Demo

`docker run -p 80:80 --name myweb -d nginx` - start an instance of nginx

`docker exec -it myweb /bin/bash` - to enter bash

In the bash prompt inside the container:

`cd /usr/share/nginx/html` - navigate to the html directory

`echo "Srihari Sridharan" > index.html`

`exit` - to exit bash

In you local machine terminal:

`docker commit myweb mynginx` - `mynginx` is the snapshot of the running container and it is created as a new image. If you do a docker images, you can find it getting listed. Thus `docker commit` is really handy in creating new images!

```
REPOSITORY                    TAG       IMAGE ID       CREATED         SIZE
mynginx                       latest    2ee2f0e46764   3 seconds ago   133MB
nginx                         latest    f8f4ffc8092c   6 days ago      133MB
hello-world                   latest    feb5d9fea6a5   11 days ago     13.3kB
gcr.io/k8s-minikube/kicbase   v0.0.27   9fa1cc16ad6d   2 weeks ago     1.08GB
busybox                       latest    16ea53ea7c65   3 weeks ago     1.24MB
```

This is a trivial example. You can create your own container with required software on top of a base image and then create a new image out of that!

You can run a container based on the new image.

`docker run -p 80:80 --name mynewweb -d mynginx` - start an instance of nginx

## Dockerfile

Programmatic way to create images. A Dockerfile is a text document that contains series of commands a user executes to assemble an image.

```dockerfile
// Image to build from
FROM openjdk:alpine

// Create working dir app
WORKDIR /usr/src/app

// Copy file(s) from host to image
[ADD/COPY] /src/path/from/host /dest/path/to/image 

// Executes command(s), used to install softwares
RUN apt-get install python3 git 

// Specify port exposed from container
EXPOSE 8080

// Configures main process executable command (process id 1)
[CMD/ENTRYPOINT] ["executable", "param1", "param2", ...] 
```

## Dockerfile Example

Refer to the node.js application in the `node-sample` directory. Refer to the docker file.

`cd node-sample`

`touch Dockerfile`

Copy paste the contents below into the `Dockerfile`.

```dockerfile
FROM node:lts-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 8000

ENTRYPOINT ["npm", "start"]
```

Use the `docker build` command to build the images.

`docker build -t hello-world-nodejs . -f Dockerfile` - The `-f Dockerfile` is optional as it looks for a file by the name `Dockerfile`. You can use the -f switch to specify a different file name.

One the image is built, you can find it by running `docker images`.

```
REPOSITORY                    TAG       IMAGE ID       CREATED          SIZE
hello-world-nodejs            latest    d43ba5d14db7   18 seconds ago   181MB
```

If you visit `http://localhost:8000`, you can see a hello message with the hostname printed in the next line. Interestingly, the hostname and the container will be same!

If you execute this command again, you will see that the build process uses the cache to build the image, as there were no changes.

`docker build -t hello-world-nodejs . -f Dockerfile`

```
[+] Building 1.8s (9/9) FINISHED                                                                                                                 
 => [internal] load build definition from Dockerfile                                                                                        0.0s
 => => transferring dockerfile: 36B                                                                                                         0.0s
 => [internal] load .dockerignore                                                                                                           0.0s
 => => transferring context: 2B                                                                                                             0.0s
 => [internal] load metadata for docker.io/library/node:lts-alpine                                                                          1.2s
 => [1/4] FROM docker.io/library/node:lts-alpine@sha256:6e52e0b3bedfb494496488514d18bee7fd503fd4e44289ea012ad02f8f41a312                    0.0s
 => [internal] load build context                                                                                                           0.5s
 => => transferring context: 445.70kB                                                                                                       0.4s
 => CACHED [2/4] WORKDIR /usr/src/app                                                                                                       0.0s
 => CACHED [3/4] COPY . .                                                                                                                   0.0s
 => CACHED [4/4] RUN npm install                                                                                                            0.0s
 => exporting to image                                                                                                                      0.0s
 => => exporting layers                                                                                                                     0.0s
 => => writing image sha256:d43ba5d14db70dd3efa508dc39aa29928c4b0cba581ef84513dcf6e6220eba08                                                0.0s
 => => naming to docker.io/library/hello-world-nodejs                                                                                       0.0s

Use 'docker scan' to run Snyk tests against images to find vulnerabilities and learn how to fix them
```

If we make a change to the code, we can see that the build process doesn't use the cache and builds the image again.

Make a code change in the node app and run the command once again!

`docker build -t hello-world-nodejs . -f Dockerfile`

Until step 2 it is cached. After that it runs the build once again!

```
[+] Building 22.7s (9/9) FINISHED                                                                                                                                                                     
 => [internal] load build definition from Dockerfile                                                                                                                                             0.0s
 => => transferring dockerfile: 36B                                                                                                                                                              0.0s
 => [internal] load .dockerignore                                                                                                                                                                0.0s
 => => transferring context: 2B                                                                                                                                                                  0.0s
 => [internal] load metadata for docker.io/library/node:lts-alpine                                                                                                                               3.5s
 => [1/4] FROM docker.io/library/node:lts-alpine@sha256:6e52e0b3bedfb494496488514d18bee7fd503fd4e44289ea012ad02f8f41a312                                                                         0.0s
 => [internal] load build context                                                                                                                                                                0.6s
 => => transferring context: 446.05kB                                                                                                                                                            0.5s
 => CACHED [2/4] WORKDIR /usr/src/app                                                                                                                                                            0.0s
 => [3/4] COPY . .                                                                                                                                                                               1.4s
 => [4/4] RUN npm install                                                                                                                                                                       15.3s
 => exporting to image                                                                                                                                                                           1.7s
 => => exporting layers                                                                                                                                                                          1.7s
 => => writing image sha256:98df0db486ec5fc3c14488f5679279fa457f38e372581899aeb37f06311b9dcb                                                                                                     0.0s 
 => => naming to docker.io/library/hello-world-nodejs                                                                                                                                            0.0s 
                                                                                                                                                                                                      
Use 'docker scan' to run Snyk tests against images to find vulnerabilities and learn how to fix them

```

Now let us create the Dockerfile for `metadata-service`. The source code can be found @ `https://github.com/boot-services/metadata-service`. Clone the repository in folder `metadata-service` and follow the steps below.

Once cloned, navigate to the `metadata-service` directory and build the application using `mvn package`. This generates the jar file in the target folder `target/metadata-service.jar`.

The Dockerfile is shown below:

```dockerfile
FROM openjdk:8-jdk-alpine

EXPOSE 8080

ARG JAR_FILE=target/metadata-service.jar

ADD ${JAR_FILE} app.jar

ENTRYPOINT [ "java", "-jar", "app.jar" ]
```

The command `docker build -t metadata-service .` - builds the image.

```
[+] Building 15.5s (7/7) FINISHED                                                                                                                
 => [internal] load build definition from Dockerfile                                                                                        0.0s
 => => transferring dockerfile: 191B                                                                                                        0.0s
 => [internal] load .dockerignore                                                                                                           0.0s
 => => transferring context: 2B                                                                                                             0.0s
 => [internal] load metadata for docker.io/library/openjdk:8-jdk-alpine                                                                     4.8s
 => [internal] load build context                                                                                                           0.8s
 => => transferring context: 24.57MB                                                                                                        0.8s
 => [1/2] FROM docker.io/library/openjdk:8-jdk-alpine@sha256:94792824df2df33402f201713f932b58cb9de94a0cd524164a0f2283343547b3              10.3s
 => => resolve docker.io/library/openjdk:8-jdk-alpine@sha256:94792824df2df33402f201713f932b58cb9de94a0cd524164a0f2283343547b3               0.0s
 => => sha256:a3562aa0b991a80cfe8172847c8be6dbf6e46340b759c2b782f8b8be45342717 3.40kB / 3.40kB                                              0.0s
 => => sha256:e7c96db7181be991f19a9fb6975cdbbd73c65f4a2681348e63a141a2192a5f10 2.76MB / 2.76MB                                              0.6s
 => => sha256:f910a506b6cb1dbec766725d70356f695ae2bf2bea6224dbe8c7c6ad4f3664a2 238B / 238B                                                  0.6s
 => => sha256:c2274a1a0e2786ee9101b08f76111f9ab8019e368dce1e325d3c284a0ca33397 70.73MB / 70.73MB                                            8.4s
 => => sha256:94792824df2df33402f201713f932b58cb9de94a0cd524164a0f2283343547b3 1.64kB / 1.64kB                                              0.0s
 => => sha256:44b3cea369c947527e266275cee85c71a81f20fc5076f6ebb5a13f19015dce71 947B / 947B                                                  0.0s
 => => extracting sha256:e7c96db7181be991f19a9fb6975cdbbd73c65f4a2681348e63a141a2192a5f10                                                   0.2s
 => => extracting sha256:f910a506b6cb1dbec766725d70356f695ae2bf2bea6224dbe8c7c6ad4f3664a2                                                   0.0s
 => => extracting sha256:c2274a1a0e2786ee9101b08f76111f9ab8019e368dce1e325d3c284a0ca33397                                                   1.6s
 => [2/2] ADD target/metadata-service.jar app.jar                                                                                           0.1s
```

The image can be found by listing the images `docker images`.

```
REPOSITORY                    TAG       IMAGE ID       CREATED          SIZE
metadata-service              latest    8577ec8071f3   27 minutes ago   129MB
```

## Image Layers

Each command in docker file creates an image layer!

---------------------------------------------------------

Layer 5: Runtime (Read write Layer - other layers are read-only)

---------------------------------------------------------

Layer 4: NPM Modules

---------------------------------------------------------

Layer 3: Copy Application Source Code

---------------------------------------------------------

Layer 2: Create Working Directory

---------------------------------------------------------

Layer 1: Base Image

---------------------------------------------------------

The command `docker build -t hello-world-node.js .` build the image and you can observe the image layers as part of the output.

```
[+] Building 38.6s (9/9) FINISHED                                                                                                                               
 => [internal] load build definition from Dockerfile                                                                                                       0.1s
 => => transferring dockerfile: 36B                                                                                                                        0.0s
 => [internal] load .dockerignore                                                                                                                          0.0s
 => => transferring context: 2B                                                                                                                            0.0s
 => [internal] load metadata for docker.io/library/node:lts-alpine                                                                                         4.9s
 => [1/4] FROM docker.io/library/node:lts-alpine@sha256:a251de4db0e0632446c0ba62adbe1e37ff148a53732e4574d2ed0f5462cc4407                                  13.7s
 => => resolve docker.io/library/node:lts-alpine@sha256:a251de4db0e0632446c0ba62adbe1e37ff148a53732e4574d2ed0f5462cc4407                                   0.0s
 => => sha256:a251de4db0e0632446c0ba62adbe1e37ff148a53732e4574d2ed0f5462cc4407 1.43kB / 1.43kB                                                             0.0s
 => => sha256:557f00fb5d780597b0e7bcdc6d93abeb7e73599bcbfeba5832dc5646a8d3f120 1.16kB / 1.16kB                                                             0.0s
 => => sha256:fe39f43f1d22b08e20e0e4493494bd2ae1270d2d68c20a65d77ac2a46e2054ab 6.53kB / 6.53kB                                                             0.0s
 => => sha256:c7ad74aede755227d79ac0411c549922ad260721212dcb2833a558798a24e032 36.37MB / 36.37MB                                                           9.7s
 => => sha256:995c08d8ac36c3e26055c6a140c56fcc09741c9aadab8c226912fe3e6283a0fb 2.24MB / 2.24MB                                                             1.6s
 => => sha256:eac3374fce0fd639864aafd04a3f4886cea683230faa360ae57f557232c0351d 282B / 282B                                                                 0.6s
 => => extracting sha256:c7ad74aede755227d79ac0411c549922ad260721212dcb2833a558798a24e032                                                                  3.0s
 => => extracting sha256:995c08d8ac36c3e26055c6a140c56fcc09741c9aadab8c226912fe3e6283a0fb                                                                  0.2s
 => => extracting sha256:eac3374fce0fd639864aafd04a3f4886cea683230faa360ae57f557232c0351d                                                                  0.0s
 => [internal] load build context                                                                                                                          2.0s
 => => transferring context: 445.70kB                                                                                                                      1.9s
 => [2/4] WORKDIR /usr/src/app                                                                                                                             0.2s
 => [3/4] COPY . .                                                                                                                                         3.1s
 => [4/4] RUN npm install                                                                                                                                 15.1s
 => exporting to image                                                                                                                                     1.3s
 => => exporting layers                                                                                                                                    1.3s
 => => writing image sha256:bbb06984711959182e5c9b20f3fb21de2c9fe65b8868c3e80b86fb22c42762f1                                                               0.0s 
 => => naming to docker.io/library/hello-world-node.js                                                                                                     0.0s
```

Once the image is built, run the below command to see the history of instructions run one by one.

`docker history hello-world-node.js`

```
IMAGE          CREATED          CREATED BY                                      SIZE      COMMENT
bbb069847119   13 minutes ago   ENTRYPOINT ["npm" "start"]                      0B        buildkit.dockerfile.v0
<missing>      13 minutes ago   EXPOSE map[8000/tcp:{}]                         0B        buildkit.dockerfile.v0
<missing>      13 minutes ago   RUN /bin/sh -c npm install # buildkit           35MB      buildkit.dockerfile.v0
<missing>      13 minutes ago   COPY . . # buildkit                             28.4MB    buildkit.dockerfile.v0
<missing>      13 minutes ago   WORKDIR /usr/src/app                            0B        buildkit.dockerfile.v0
<missing>      5 days ago       /bin/sh -c #(nop)  CMD ["node"]                 0B        
<missing>      5 days ago       /bin/sh -c #(nop)  ENTRYPOINT ["docker-entry…   0B        
<missing>      5 days ago       /bin/sh -c #(nop) COPY file:238737301d473041…   116B      
<missing>      5 days ago       /bin/sh -c apk add --no-cache --virtual .bui…   7.63MB    
<missing>      5 days ago       /bin/sh -c #(nop)  ENV YARN_VERSION=1.22.15     0B        
<missing>      5 days ago       /bin/sh -c addgroup -g 1000 node     && addu…   104MB     
<missing>      5 days ago       /bin/sh -c #(nop)  ENV NODE_VERSION=14.18.1     0B        
<missing>      6 weeks ago      /bin/sh -c #(nop)  CMD ["/bin/sh"]              0B        
<missing>      6 weeks ago      /bin/sh -c #(nop) ADD file:9d14b111839839230…   5.62MB    

```

If you observe the history, each command has created a layer and the intermediate image ids are available. Observe the `SIZE` column to see how the size of the image increased. Intermediate images are in the cache and not shown as part of your `docker images` command. If you run the `docker build` command after a code change, the layer with the change and the ones above are rebuilt.

In case of a node.js app, if you want to avoid rebuilding the image when no dependencies have changed, in the `Dockerfile`, copy the `package.json` first and then do a `npm install` and then copy the source code.

```dockerfile
FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8000

ENTRYPOINT ["npm", "start"]
```

Run `docker build -t hello-world-node.js .`

```
[+] Building 16.9s (10/10) FINISHED                                                                                                                             
 => [internal] load build definition from Dockerfile                                                                                                       0.0s
 => => transferring dockerfile: 179B                                                                                                                       0.0s
 => [internal] load .dockerignore                                                                                                                          0.0s
 => => transferring context: 2B                                                                                                                            0.0s
 => [internal] load metadata for docker.io/library/node:lts-alpine                                                                                         2.8s
 => [1/5] FROM docker.io/library/node:lts-alpine@sha256:a251de4db0e0632446c0ba62adbe1e37ff148a53732e4574d2ed0f5462cc4407                                   0.0s
 => [internal] load build context                                                                                                                          0.6s
 => => transferring context: 445.84kB                                                                                                                      0.6s
 => CACHED [2/5] WORKDIR /usr/src/app                                                                                                                      0.0s
 => [3/5] COPY package*.json ./                                                                                                                            0.1s
 => [4/5] RUN npm install                                                                                                                                 10.8s
 => [5/5] COPY . .                                                                                                                                         1.1s
 => exporting to image                                                                                                                                     1.4s 
 => => exporting layers                                                                                                                                    1.3s 
 => => writing image sha256:0ce9219ac5556f86846f3919ede67d9d823cee5cfec77e5aa3b67364db08d9c5                                                               0.0s 
 => => naming to docker.io/library/hello-world-node.js                                                                                                     0.0s
```

It has not used cache and built the image ground up.

`NOTE:` When the `docker build` command is run more than once after making code changes, the previous image gets orphaned and a new image gets created. These orphaned images are indicated by `<none>` in the `REPOSITORY` column.

Now let us make a code change in the node.js app. (Make any change in `server.js`).

Rebuild the image using `docker build -t hello-world-node.js .`

```
[+] Building 5.0s (10/10) FINISHED                                                                                                                              
 => [internal] load build definition from Dockerfile                                                                                                       0.0s
 => => transferring dockerfile: 37B                                                                                                                        0.0s
 => [internal] load .dockerignore                                                                                                                          0.0s
 => => transferring context: 2B                                                                                                                            0.0s
 => [internal] load metadata for docker.io/library/node:lts-alpine                                                                                         2.6s
 => [1/5] FROM docker.io/library/node:lts-alpine@sha256:a251de4db0e0632446c0ba62adbe1e37ff148a53732e4574d2ed0f5462cc4407                                   0.0s
 => [internal] load build context                                                                                                                          0.4s
 => => transferring context: 446.06kB                                                                                                                      0.4s
 => CACHED [2/5] WORKDIR /usr/src/app                                                                                                                      0.0s
 => CACHED [3/5] COPY package*.json ./                                                                                                                     0.0s
 => CACHED [4/5] RUN npm install                                                                                                                           0.0s
 => [5/5] COPY . .                                                                                                                                         0.9s
 => exporting to image                                                                                                                                     0.9s
 => => exporting layers                                                                                                                                    0.9s
 => => writing image sha256:64916ddd6e574317c5ccc260efb58dcb6d6bfbb9af8d324480758a1186e8ba5a                                                               0.0s
 => => naming to docker.io/library/hello-world-node.js                                                                                                     0.0s


```

Observe that the `docker build` has used cache until the step `CACHED [4/5] RUN npm install`. Which is the expected outcome as none of the dependencies have changed.

Now, make a change in `package.json` to one of the dependencies. Let us update the version for `express`. `4.17.1` is the latest version of this writing (OCT 2021).

Running `docker build -t hello-world-node.js .` and observing the output below:

```
[+] Building 14.8s (10/10) FINISHED                                                                                                                             
 => [internal] load build definition from Dockerfile                                                                                                       0.0s
 => => transferring dockerfile: 37B                                                                                                                        0.0s
 => [internal] load .dockerignore                                                                                                                          0.0s
 => => transferring context: 2B                                                                                                                            0.0s
 => [internal] load metadata for docker.io/library/node:lts-alpine                                                                                         1.4s
 => [1/5] FROM docker.io/library/node:lts-alpine@sha256:a251de4db0e0632446c0ba62adbe1e37ff148a53732e4574d2ed0f5462cc4407                                   0.0s
 => [internal] load build context                                                                                                                          0.6s
 => => transferring context: 446.02kB                                                                                                                      0.6s
 => CACHED [2/5] WORKDIR /usr/src/app                                                                                                                      0.0s
 => [3/5] COPY package*.json ./                                                                                                                            0.1s
 => [4/5] RUN npm install                                                                                                                                 10.3s
 => [5/5] COPY . .                                                                                                                                         0.9s
 => exporting to image                                                                                                                                     1.5s 
 => => exporting layers                                                                                                                                    1.5s 
 => => writing image sha256:9886f9e80ec95ea73a18e34b68c7a6b6ba9d0da3193e0d70b5b944eba5d2a448                                                               0.0s 
 => => naming to docker.io/library/hello-world-node.js                                                                                                     0.0s 
                                                                                                                           
```

Observe that only until step 2 is cached. It doesn't use cache for copying `package.json` and `npm install` as we have changes.

Running `docker history hello-world-node.js` shows the `npm install` size is around `35MB`. This is due to the fact that `package.json` has devDependencies which are required for development but not for production.

```
IMAGE          CREATED          CREATED BY                                      SIZE      COMMENT
9886f9e80ec9   13 minutes ago   ENTRYPOINT ["npm" "start"]                      0B        buildkit.dockerfile.v0
<missing>      13 minutes ago   EXPOSE map[8000/tcp:{}]                         0B        buildkit.dockerfile.v0
<missing>      13 minutes ago   COPY . . # buildkit                             28.4MB    buildkit.dockerfile.v0
<missing>      13 minutes ago   RUN /bin/sh -c npm install # buildkit           35MB      buildkit.dockerfile.v0
<missing>      13 minutes ago   COPY package*.json ./ # buildkit                300kB     buildkit.dockerfile.v0
<missing>      53 minutes ago   WORKDIR /usr/src/app                            0B        buildkit.dockerfile.v0
<missing>      6 days ago       /bin/sh -c #(nop)  CMD ["node"]                 0B        
<missing>      6 days ago       /bin/sh -c #(nop)  ENTRYPOINT ["docker-entry…   0B        
<missing>      6 days ago       /bin/sh -c #(nop) COPY file:238737301d473041…   116B      
<missing>      6 days ago       /bin/sh -c apk add --no-cache --virtual .bui…   7.63MB    
<missing>      6 days ago       /bin/sh -c #(nop)  ENV YARN_VERSION=1.22.15     0B        
<missing>      6 days ago       /bin/sh -c addgroup -g 1000 node     && addu…   104MB     
<missing>      6 days ago       /bin/sh -c #(nop)  ENV NODE_VERSION=14.18.1     0B        
<missing>      6 weeks ago      /bin/sh -c #(nop)  CMD ["/bin/sh"]              0B        
<missing>      6 weeks ago      /bin/sh -c #(nop) ADD file:9d14b111839839230…   5.62MB    
```

In order to optimize, update Dockerfile to use the `npm install --only=production`.

```dockerfile
FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

EXPOSE 8000

ENTRYPOINT ["npm", "start"]
```

Run `docker build -t hello-world-node.js . ` again and the output is as below.

```
[+] Building 9.3s (10/10) FINISHED                                                                                                                              
 => [internal] load build definition from Dockerfile                                                                                                       0.0s
 => => transferring dockerfile: 197B                                                                                                                       0.0s
 => [internal] load .dockerignore                                                                                                                          0.0s
 => => transferring context: 2B                                                                                                                            0.0s
 => [internal] load metadata for docker.io/library/node:lts-alpine                                                                                         2.8s
 => [internal] load build context                                                                                                                          0.6s
 => => transferring context: 445.86kB                                                                                                                      0.6s
 => [1/5] FROM docker.io/library/node:lts-alpine@sha256:a251de4db0e0632446c0ba62adbe1e37ff148a53732e4574d2ed0f5462cc4407                                   0.0s
 => CACHED [2/5] WORKDIR /usr/src/app                                                                                                                      0.0s
 => CACHED [3/5] COPY package*.json ./                                                                                                                     0.0s
 => [4/5] RUN npm install --only=production                                                                                                                4.1s
 => [5/5] COPY . .                                                                                                                                         0.7s
 => exporting to image                                                                                                                                     0.9s 
 => => exporting layers                                                                                                                                    0.9s 
 => => writing image sha256:74ef3a88cb34012d471cd4f0005166f3889e74ab207bac7fdcd6bbec61b50472                                                               0.0s 
 => => naming to docker.io/library/hello-world-node.js                                                                                                     0.0s
```

Run `docker history hello-world-node.js`. Observe that the size has reduced drastically (`2.45MB` in this case).

```
IMAGE          CREATED          CREATED BY                                      SIZE      COMMENT
74ef3a88cb34   2 minutes ago    ENTRYPOINT ["npm" "start"]                      0B        buildkit.dockerfile.v0
<missing>      2 minutes ago    EXPOSE map[8000/tcp:{}]                         0B        buildkit.dockerfile.v0
<missing>      2 minutes ago    COPY . . # buildkit                             28.4MB    buildkit.dockerfile.v0
<missing>      2 minutes ago    RUN /bin/sh -c npm install --only=production…   2.45MB    buildkit.dockerfile.v0
<missing>      19 minutes ago   COPY package*.json ./ # buildkit                300kB     buildkit.dockerfile.v0
<missing>      59 minutes ago   WORKDIR /usr/src/app                            0B        buildkit.dockerfile.v0
<missing>      6 days ago       /bin/sh -c #(nop)  CMD ["node"]                 0B        
<missing>      6 days ago       /bin/sh -c #(nop)  ENTRYPOINT ["docker-entry…   0B        
<missing>      6 days ago       /bin/sh -c #(nop) COPY file:238737301d473041…   116B      
<missing>      6 days ago       /bin/sh -c apk add --no-cache --virtual .bui…   7.63MB    
<missing>      6 days ago       /bin/sh -c #(nop)  ENV YARN_VERSION=1.22.15     0B        
<missing>      6 days ago       /bin/sh -c addgroup -g 1000 node     && addu…   104MB     
<missing>      6 days ago       /bin/sh -c #(nop)  ENV NODE_VERSION=14.18.1     0B        
<missing>      6 weeks ago      /bin/sh -c #(nop)  CMD ["/bin/sh"]              0B        
<missing>      6 weeks ago      /bin/sh -c #(nop) ADD file:9d14b111839839230…   5.62MB    
```

Run `docker images` and observe the reduction in image size. (From `181MB` to `149MB` in this case).

```
REPOSITORY                    TAG       IMAGE ID       CREATED          SIZE
hello-world-node.js           latest    74ef3a88cb34   2 minutes ago    149MB
<none>                        <none>    9886f9e80ec9   19 minutes ago   181MB
metadata-service              latest    8577ec8071f3   13 days ago      129MB
mynginx                       latest    2ee2f0e46764   2 weeks ago      133MB
nginx                         latest    f8f4ffc8092c   2 weeks ago      133MB
hello-world                   latest    feb5d9fea6a5   3 weeks ago      13.3kB
gcr.io/k8s-minikube/kicbase   v0.0.27   9fa1cc16ad6d   4 weeks ago      1.08GB
busybox                       latest    16ea53ea7c65   5 weeks ago      1.24MB
```

> **Key:** Observe the history and start optimizing the image size! Every commit will result in new image and optimizing image size is crucial!

Pick the base image based on the size. E.g. Alpine Linux is just around `5MB` in size.

Now the layers look as shown below:

---------------------------------------------------------

Layer 6: Runtime (Read write Layer - other layers are read-only)

---------------------------------------------------------

Layer 5: Copy Application Source Code

---------------------------------------------------------

Layer 4: NPM Modules

---------------------------------------------------------

Layer 3: package.json

---------------------------------------------------------

Layer 2: Create Working Directory

---------------------------------------------------------

Layer 1: Base Image

---------------------------------------------------------

> **Tip:** In order to avoid unwanted files being passed into docker context, use the `.dockerignore` file and add folders that you want to ignore. E.g. `node_modules`. This speeds up the build!

### Separating `lib` and application `code` for `metadata-service`.

The Dockerfile looks as shown below:

```dockerfile
FROM openjdk:8-jdk-alpine

EXPOSE 8080

ADD target/metadata-service.jar metadata-service.jar

ENTRYPOINT [ "java", "-jar", "metadata-service.jar" ]
```

We need to split the lib and the application code.

`cd target`
`ls -la`

```
total 49544
drwxr-xr-x  17 srihari.sridharan  staff       544 19 Oct 10:29 .
drwxr-xr-x  15 srihari.sridharan  staff       480 19 Oct 10:29 ..
drwxr-xr-x   8 srihari.sridharan  staff       256  2 Oct 21:07 classes
drwxr-xr-x   3 srihari.sridharan  staff        96  2 Oct 21:07 generated-docs
drwxr-xr-x  16 srihari.sridharan  staff       512  6 Oct 09:00 generated-snippets
drwxr-xr-x   3 srihari.sridharan  staff        96 13 Sep 08:44 generated-sources
drwxr-xr-x   3 srihari.sridharan  staff        96 13 Sep 08:44 generated-test-sources
-rw-r--r--   1 srihari.sridharan  staff    711746 19 Oct 10:29 jacoco.exec
drwxr-xr-x   3 srihari.sridharan  staff        96  2 Oct 21:07 maven-archiver
drwxr-xr-x   3 srihari.sridharan  staff        96 13 Sep 08:44 maven-status
-rw-r--r--   1 srihari.sridharan  staff  24566207 19 Oct 10:29 metadata-service.jar
-rw-r--r--   1 srihari.sridharan  staff     39645 19 Oct 10:29 metadata-service.jar.original
-rw-r--r--   1 srihari.sridharan  staff       417  5 Oct 23:07 metadata-service.log
-rw-r--r--   1 srihari.sridharan  staff      2318  5 Oct 23:07 metadata-service.log.2021-10-02.0.gz
drwxr-xr-x   3 srihari.sridharan  staff        96  6 Oct 09:00 site
drwxr-xr-x  10 srihari.sridharan  staff       320 19 Oct 10:29 surefire-reports
drwxr-xr-x   4 srihari.sridharan  staff       128 13 Sep 08:44 test-classes
```

Create a director `app` and extract the contents of the jar into that directory.

`mkdir app`
`cd app`
`jar -xf ../metadata-service.jar`

`ls -la`

```
total 0
drwxr-xr-x   5 srihari.sridharan  staff  160 19 Oct 12:28 .
drwxr-xr-x  18 srihari.sridharan  staff  576 19 Oct 12:27 ..
drwxr-xr-x   4 srihari.sridharan  staff  128 19 Oct 10:29 BOOT-INF
drwxr-xr-x   4 srihari.sridharan  staff  128 19 Oct 10:29 META-INF
drwxr-xr-x   3 srihari.sridharan  staff   96 19 Oct 10:29 org
```

Navigate to `BOOT-INF/lib `.

`cd BOOT-INF/lib`
`la -la`
Lists all the libraries.

```
total 47968
drwxr-xr-x  58 srihari.sridharan  staff     1856 Oct 19 10:29 .
drwxr-xr-x   4 srihari.sridharan  staff      128 Oct 19 10:29 ..
-rw-r--r--   1 srihari.sridharan  staff   117910 Sep 14  2017 HdrHistogram-2.1.10.jar
-rw-r--r--   1 srihari.sridharan  staff    29779 Dec 15  2015 LatencyUtils-2.0.3.jar
-rw-r--r--   1 srihari.sridharan  staff   393369 Feb 13  2018 bson-3.6.3.jar
-rw-r--r--   1 srihari.sridharan  staff    65100 Sep  9  2017 classmate-1.3.4.jar
-rw-r--r--   1 srihari.sridharan  staff   413739 Mar 14  2018 fongo-2.2.0-RC1.jar
-rw-r--r--   1 srihari.sridharan  staff    15028 Jul 24  2014 geojson-jackson-1.2.jar
-rw-r--r--   1 srihari.sridharan  staff  1130724 Mar 27  2018 hibernate-validator-6.0.9.Final.jar
-rw-r--r--   1 srihari.sridharan  staff    66519 Jul 29  2017 jackson-annotations-2.9.0.jar
-rw-r--r--   1 srihari.sridharan  staff   321590 Mar 26  2018 jackson-core-2.9.5.jar
-rw-r--r--   1 srihari.sridharan  staff  1342410 Mar 26  2018 jackson-databind-2.9.5.jar
-rw-r--r--   1 srihari.sridharan  staff    33392 Mar 26  2018 jackson-datatype-jdk8-2.9.5.jar
-rw-r--r--   1 srihari.sridharan  staff    99630 Mar 26  2018 jackson-datatype-jsr310-2.9.5.jar
-rw-r--r--   1 srihari.sridharan  staff     8646 Mar 26  2018 jackson-module-parameter-names-2.9.5.jar
-rw-r--r--   1 srihari.sridharan  staff   129265 Feb 25  2014 jasypt-1.9.2.jar
-rw-r--r--   1 srihari.sridharan  staff    55866 Mar 17  2018 jasypt-spring-boot-2.0.0.jar
-rw-r--r--   1 srihari.sridharan  staff     3649 Mar 17  2018 jasypt-spring-boot-starter-2.0.0.jar
-rw-r--r--   1 srihari.sridharan  staff    26586 Feb 21  2018 javax.annotation-api-1.3.2.jar
-rw-r--r--   1 srihari.sridharan  staff    66469 Feb 14  2018 jboss-logging-3.3.2.Final.jar
-rw-r--r--   1 srihari.sridharan  staff   794991 Dec 14  2012 jts-1.13.jar
-rw-r--r--   1 srihari.sridharan  staff     4596 Mar 16  2017 jul-to-slf4j-1.7.25.jar
-rw-r--r--   1 srihari.sridharan  staff   255485 Nov 19  2017 log4j-api-2.10.0.jar
-rw-r--r--   1 srihari.sridharan  staff    17519 Nov 19  2017 log4j-to-slf4j-2.10.0.jar
-rw-r--r--   1 srihari.sridharan  staff   290339 Mar 31  2017 logback-classic-1.2.3.jar
-rw-r--r--   1 srihari.sridharan  staff   471901 Mar 31  2017 logback-core-1.2.3.jar
-rw-r--r--   1 srihari.sridharan  staff   302539 Apr  4  2018 micrometer-core-1.0.3.jar
-rw-r--r--   1 srihari.sridharan  staff   387320 Feb 13  2018 mongodb-driver-3.6.3.jar
-rw-r--r--   1 srihari.sridharan  staff  1118202 Feb 13  2018 mongodb-driver-core-3.6.3.jar
-rw-r--r--   1 srihari.sridharan  staff  1256582 Feb  1  2016 rhino-1.7.7.1.jar
-rw-r--r--   1 srihari.sridharan  staff    41203 Mar 16  2017 slf4j-api-1.7.25.jar
-rw-r--r--   1 srihari.sridharan  staff   297518 Oct 14  2017 snakeyaml-1.19.jar
-rw-r--r--   1 srihari.sridharan  staff   366070 Apr  3  2018 spring-aop-5.0.5.RELEASE.jar
-rw-r--r--   1 srihari.sridharan  staff   660347 Apr  3  2018 spring-beans-5.0.5.RELEASE.jar
-rw-r--r--   1 srihari.sridharan  staff   927684 Apr  5  2018 spring-boot-2.0.1.RELEASE.jar
-rw-r--r--   1 srihari.sridharan  staff   459241 Apr  5  2018 spring-boot-actuator-2.0.1.RELEASE.jar
-rw-r--r--   1 srihari.sridharan  staff   371927 Apr  5  2018 spring-boot-actuator-autoconfigure-2.0.1.RELEASE.jar
-rw-r--r--   1 srihari.sridharan  staff  1154874 Apr  5  2018 spring-boot-autoconfigure-2.0.1.RELEASE.jar
-rw-r--r--   1 srihari.sridharan  staff      592 Apr  5  2018 spring-boot-starter-2.0.1.RELEASE.jar
-rw-r--r--   1 srihari.sridharan  staff      612 Apr  5  2018 spring-boot-starter-actuator-2.0.1.RELEASE.jar
-rw-r--r--   1 srihari.sridharan  staff      612 Apr  5  2018 spring-boot-starter-data-mongodb-2.0.1.RELEASE.jar
-rw-r--r--   1 srihari.sridharan  staff      645 Apr  5  2018 spring-boot-starter-json-2.0.1.RELEASE.jar
-rw-r--r--   1 srihari.sridharan  staff      613 Apr  5  2018 spring-boot-starter-logging-2.0.1.RELEASE.jar
-rw-r--r--   1 srihari.sridharan  staff      591 Apr  5  2018 spring-boot-starter-tomcat-2.0.1.RELEASE.jar
-rw-r--r--   1 srihari.sridharan  staff      588 Apr  5  2018 spring-boot-starter-web-2.0.1.RELEASE.jar
-rw-r--r--   1 srihari.sridharan  staff  1091130 Apr  3  2018 spring-context-5.0.5.RELEASE.jar
-rw-r--r--   1 srihari.sridharan  staff  1226331 Apr  3  2018 spring-core-5.0.5.RELEASE.jar
-rw-r--r--   1 srihari.sridharan  staff  1073770 Apr  4  2018 spring-data-commons-2.0.6.RELEASE.jar
-rw-r--r--   1 srihari.sridharan  staff  1243698 Apr  4  2018 spring-data-mongodb-2.0.6.RELEASE.jar
-rw-r--r--   1 srihari.sridharan  staff   277556 Apr  3  2018 spring-expression-5.0.5.RELEASE.jar
-rw-r--r--   1 srihari.sridharan  staff    21703 Apr  3  2018 spring-jcl-5.0.5.RELEASE.jar
-rw-r--r--   1 srihari.sridharan  staff   255027 Apr  3  2018 spring-tx-5.0.5.RELEASE.jar
-rw-r--r--   1 srihari.sridharan  staff  1254601 Apr  3  2018 spring-web-5.0.5.RELEASE.jar
-rw-r--r--   1 srihari.sridharan  staff   789760 Apr  3  2018 spring-webmvc-5.0.5.RELEASE.jar
-rw-r--r--   1 srihari.sridharan  staff  3101322 Mar  5  2018 tomcat-embed-core-8.5.29.jar
-rw-r--r--   1 srihari.sridharan  staff   240222 Mar  5  2018 tomcat-embed-el-8.5.29.jar
-rw-r--r--   1 srihari.sridharan  staff   256816 Mar  5  2018 tomcat-embed-websocket-8.5.29.jar
-rw-r--r--   1 srihari.sridharan  staff    93107 Dec 19  2017 validation-api-2.0.1.Final.jar
```

Similarly classes are inside `BOOT-INF/classes`.

Modify the `Dockerfile` to copy the libs, meta and classes.

```dockerfile

```

Traverse to `metadata-service` - the root folder containing `Dockerfile`.

Build the image using `docker build -t metadata-service .`.

```
[+] Building 4.1s (9/9) FINISHED                                                                                                                 
 => [internal] load build definition from Dockerfile                                                                                        0.0s
 => => transferring dockerfile: 376B                                                                                                        0.0s
 => [internal] load .dockerignore                                                                                                           0.0s
 => => transferring context: 2B                                                                                                             0.0s
 => [internal] load metadata for docker.io/library/openjdk:8-jdk-alpine                                                                     2.9s
 => CACHED [1/4] FROM docker.io/library/openjdk:8-jdk-alpine@sha256:94792824df2df33402f201713f932b58cb9de94a0cd524164a0f2283343547b3        0.0s
 => [internal] load build context                                                                                                           0.7s
 => => transferring context: 24.60MB                                                                                                        0.7s
 => [2/4] ADD target/app/BOOT-INF/lib /app/lib                                                                                              0.1s
 => [3/4] ADD target/app/META-INF /app/META-INF                                                                                             0.0s
 => [4/4] ADD target/app/BOOT-INF/classes /app                                                                                              0.0s
 => exporting to image                                                                                                                      0.2s
 => => exporting layers                                                                                                                     0.2s
 => => writing image sha256:a074e23a273a5e778cdc9cdbe094f867369cc0c1351183c0ec7aac9c533fd646                                                0.0s
 => => naming to docker.io/library/metadata-service                                                                                         0.0s
```

Check `docker history metadata-service`, we can see the `ADD` steps that we introduced.

```
IMAGE          CREATED         CREATED BY                                      SIZE      COMMENT
a074e23a273a   2 minutes ago   ENTRYPOINT ["java" "-cp" "app:app/lib/*" "or…   0B        buildkit.dockerfile.v0
<missing>      2 minutes ago   EXPOSE map[8080/tcp:{}]                         0B        buildkit.dockerfile.v0
<missing>      2 minutes ago   ADD target/app/BOOT-INF/classes /app # build…   150kB     buildkit.dockerfile.v0
<missing>      2 minutes ago   ADD target/app/META-INF /app/META-INF # buil…   7.38kB    buildkit.dockerfile.v0
<missing>      2 minutes ago   ADD target/app/BOOT-INF/lib /app/lib # build…   24.4MB    buildkit.dockerfile.v0
<missing>      2 years ago     /bin/sh -c set -x  && apk add --no-cache   o…   99.3MB    
<missing>      2 years ago     /bin/sh -c #(nop)  ENV JAVA_ALPINE_VERSION=8…   0B        
<missing>      2 years ago     /bin/sh -c #(nop)  ENV JAVA_VERSION=8u212       0B        
<missing>      2 years ago     /bin/sh -c #(nop)  ENV PATH=/usr/local/sbin:…   0B        
<missing>      2 years ago     /bin/sh -c #(nop)  ENV JAVA_HOME=/usr/lib/jv…   0B        
<missing>      2 years ago     /bin/sh -c {   echo '#!/bin/sh';   echo 'set…   87B       
<missing>      2 years ago     /bin/sh -c #(nop)  ENV LANG=C.UTF-8             0B        
<missing>      2 years ago     /bin/sh -c #(nop)  CMD ["/bin/sh"]              0B        
<missing>      2 years ago     /bin/sh -c #(nop) ADD file:a86aea1f3a7d68f6a…   5.53MB    
```

Observe the layers in the images. Source code changes will not affect the `lib`.

Now to minimize the context (as we did in the node.js app), include a `.dockerignore` file to ignore everything except `target/app`. The contents of the file looks like:

```dockerignore
**
!target/app
```

`**` - ignore everything
`!target/app` - except target/app

## Multi-stage Build

While we have optimized image layers and added `.dockerignore` to reduce the load on context, we till have a challenge with respect to the build `mvn package` command running outside the `Dockerfile`. We need to use docker to build the artifacts.

Create a new file `Dockerfile.build`

```dockerfile
FROM maven
WORKDIR /workspace/app

# build mavem .m2 cache as a layer for reuse
COPY pom.xml pom.xml
RUN mvn dependency:go-offline -B

COPY src src
RUN mvn package -DskipTests

EXPOSE 8080
ENTRYPOINT [ "java", "-jar", "-Xms256m", "-Xmx512m", "target/metadata-service.jar" ]
```

> NOTE: Before proceeding any further, go ahead and comment the contents of `.dockerignore` that we added earlier. The `.dockerignore` file that we added, ignores all the files except `target/app`. The `docker build` will fail to copy the `pom.xml` and `src` folders and will throw a cryptic error as shown below:

```
[+] Building 1.4s (9/10)                                                                                                                                          
 => [internal] load build definition from Dockerfile.build                                                                                                   0.0s
 => => transferring dockerfile: 43B                                                                                                                          0.0s
 => [internal] load .dockerignore                                                                                                                            0.0s
 => => transferring context: 34B                                                                                                                             0.0s
 => [internal] load metadata for docker.io/library/maven:latest                                                                                              1.3s
 => [1/6] FROM docker.io/library/maven@sha256:6ef014c142ea5c3582920ea254920c463d3578b57189e4048044fe3a6cb5fed2                                               0.0s
 => => resolve docker.io/library/maven@sha256:6ef014c142ea5c3582920ea254920c463d3578b57189e4048044fe3a6cb5fed2                                               0.0s
 => [internal] load build context                                                                                                                            0.0s
 => => transferring context: 2B                                                                                                                              0.0s
 => CACHED [2/6] WORKDIR /workspace/app                                                                                                                      0.0s
 => ERROR [3/6] COPY pom.xml pom.xml                                                                                                                         0.0s
 => CACHED [4/6] RUN mvn dependency:go-offline -B                                                                                                            0.0s
 => ERROR [5/6] COPY src src                                                                                                                                 0.0s
------
 > [3/6] COPY pom.xml pom.xml:
------
------
 > [5/6] COPY src src:
------
failed to compute cache key: "/pom.xml" not found: not found
```

Comment out or remove the contents in `.dockerignore` and ensure that files required to be copied are not ignored!

Use the `docker build` command passing the build file as shown below:

`docker build -t metadata-build . -f Dockerfile.build`

```
[+] Building 324.1s (11/11) FINISHED                                                                                                                              
 => [internal] load build definition from Dockerfile.build                                                                                                   0.0s
 => => transferring dockerfile: 43B                                                                                                                          0.0s
 => [internal] load .dockerignore                                                                                                                            0.0s
 => => transferring context: 56B                                                                                                                             0.0s
 => [internal] load metadata for docker.io/library/maven:latest                                                                                              1.3s
 => [internal] load build context                                                                                                                            0.0s
 => => transferring context: 56.42kB                                                                                                                         0.0s
 => [1/6] FROM docker.io/library/maven@sha256:6ef014c142ea5c3582920ea254920c463d3578b57189e4048044fe3a6cb5fed2                                               0.0s
 => => resolve docker.io/library/maven@sha256:6ef014c142ea5c3582920ea254920c463d3578b57189e4048044fe3a6cb5fed2                                               0.0s
 => CACHED [2/6] WORKDIR /workspace/app                                                                                                                      0.0s
 => [3/6] COPY pom.xml pom.xml                                                                                                                               0.0s
 => [4/6] RUN mvn dependency:go-offline -B                                                                                                                 300.0s
 => [5/6] COPY src src                                                                                                                                       0.0s 
 => [6/6] RUN mvn package -DskipTests                                                                                                                       21.5s 
 => exporting to image                                                                                                                                       1.2s 
 => => exporting layers                                                                                                                                      1.2s 
 => => writing image sha256:8e5b4490561267149e84764298bb3c714e407934a0b7256125784501fe3bf562                                                                 0.0s 
 => => naming to docker.io/library/metadata-build                                                                                                            0.0s 
```

Running `docker images` will show the new image. That said it is around `900MB`.

```
REPOSITORY                    TAG       IMAGE ID       CREATED          SIZE
metadata-build                latest    8e5b44905612   17 minutes ago   900MB
```

Let us use `docker history metadata-build` and inspect.

```
IMAGE          CREATED             CREATED BY                                      SIZE      COMMENT
8e5b44905612   27 minutes ago      ENTRYPOINT ["java" "-jar" "-Xms256m" "-Xmx51…   0B        buildkit.dockerfile.v0
<missing>      27 minutes ago      EXPOSE map[8080/tcp:{}]                         0B        buildkit.dockerfile.v0
<missing>      27 minutes ago      RUN /bin/sh -c mvn package -DskipTests # bui…   26.6MB    buildkit.dockerfile.v0
<missing>      27 minutes ago      COPY src src # buildkit                         46.7kB    buildkit.dockerfile.v0
<missing>      27 minutes ago      RUN /bin/sh -c mvn dependency:go-offline -B …   102MB     buildkit.dockerfile.v0
<missing>      32 minutes ago      COPY pom.xml pom.xml # buildkit                 6.7kB     buildkit.dockerfile.v0
<missing>      About an hour ago   WORKDIR /workspace/app                          0B        buildkit.dockerfile.v0
<missing>      5 days ago          /bin/sh -c #(nop)  CMD ["mvn"]                  0B        
<missing>      5 days ago          /bin/sh -c #(nop)  ENTRYPOINT ["/usr/local/b…   0B        
<missing>      5 days ago          /bin/sh -c #(nop) COPY file:2bbb488dd73c55d6…   327B      
<missing>      5 days ago          /bin/sh -c #(nop) COPY file:1b3da5c58894f705…   1.65kB    
<missing>      5 days ago          /bin/sh -c #(nop)  ENV MAVEN_CONFIG=/root/.m2   0B        
<missing>      5 days ago          /bin/sh -c #(nop)  ENV MAVEN_HOME=/usr/share…   0B        
<missing>      5 days ago          |4 BASE_URL=https://apache.osuosl.org/maven/…   10.6MB    
<missing>      5 days ago          |4 BASE_URL=https://apache.osuosl.org/maven/…   290MB     
<missing>      5 days ago          /bin/sh -c #(nop)  ARG BASE_URL=https://apac…   0B        
<missing>      5 days ago          /bin/sh -c #(nop)  ARG SHA=1c12a5df434217950…   0B        
<missing>      5 days ago          /bin/sh -c #(nop)  ARG USER_HOME_DIR=/root      0B        
<missing>      5 days ago          /bin/sh -c #(nop)  ARG MAVEN_VERSION=3.8.3      0B        
<missing>      5 days ago          /bin/sh -c #(nop)  CMD ["jshell"]               0B        
<missing>      5 days ago          /bin/sh -c set -eux;   arch="$(objdump="$(co…   321MB     
<missing>      5 days ago          /bin/sh -c #(nop)  ENV JAVA_VERSION=17          0B        
<missing>      5 days ago          /bin/sh -c #(nop)  ENV LANG=C.UTF-8             0B        
<missing>      5 days ago          /bin/sh -c #(nop)  ENV PATH=/usr/java/openjd…   0B        
<missing>      5 days ago          /bin/sh -c #(nop)  ENV JAVA_HOME=/usr/java/o…   0B        
<missing>      5 days ago          /bin/sh -c set -eux;  microdnf install   gzi…   39.6MB    
<missing>      5 days ago          /bin/sh -c #(nop)  CMD ["/bin/bash"]            0B        
<missing>      5 days ago          /bin/sh -c #(nop) ADD file:3223e5829b65b376c…   110MB     
```

Launch the container using the command

`docker run -p 8081:8080 -d --name metabuild metadata-build`

We an view the logs using the command

`docker logs metabuild`

We an use the interactive shell to view the contents in the container.

`docker exec -it metabuild /bin/bash`

Still the size of the images is huge! `900MB`

The solution to this is multi-stage build.

Below is a multi-stage build file! `Dockerfile.multistage`

```dockerfile
# Build Stage
FROM maven AS build
WORKDIR /workspace/app

# build mavem .m2 cache as a layer for reuse
COPY pom.xml pom.xml
RUN mvn dependency:go-offline -B

COPY src src
RUN mvn package -DskipTests
RUN mkdir -p target/dependency && (cd target/dependency; jar -xf ../*.jar)

# Run Stage
FROM openjdk:alpine
VOLUME /tmp
ARG DEPENDENCY=/workspace/app/target/dependency
COPY --from=build ${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY --from=build ${DEPENDENCY}/META-INF /app/META-INF
COPY --from=build ${DEPENDENCY}/BOOT-INF/classes /app
EXPOSE 8080

ENTRYPOINT [ "java", "-cp", "app:app/lib/*", "org.boot.services.metadata.Application" ]
```

Build the image: `docker build -t metadata-service . -f Dockerfile.multistage`

```
[+] Building 3.2s (17/17) FINISHED                                                                                                                                
 => [internal] load build definition from Dockerfile.multistage                                                                                              0.0s
 => => transferring dockerfile: 48B                                                                                                                          0.0s
 => [internal] load .dockerignore                                                                                                                            0.0s
 => => transferring context: 34B                                                                                                                             0.0s
 => [internal] load metadata for docker.io/library/openjdk:alpine                                                                                            3.1s
 => [internal] load metadata for docker.io/library/maven:latest                                                                                              2.8s
 => [stage-1 1/4] FROM docker.io/library/openjdk:alpine@sha256:1fd5a77d82536c88486e526da26ae79b6cd8a14006eb3da3a25eb8d2d682ccd6                              0.0s
 => [build 1/7] FROM docker.io/library/maven@sha256:6ef014c142ea5c3582920ea254920c463d3578b57189e4048044fe3a6cb5fed2                                         0.0s
 => => resolve docker.io/library/maven@sha256:6ef014c142ea5c3582920ea254920c463d3578b57189e4048044fe3a6cb5fed2                                               0.0s
 => [internal] load build context                                                                                                                            0.0s
 => => transferring context: 2.70kB                                                                                                                          0.0s
 => CACHED [build 2/7] WORKDIR /workspace/app                                                                                                                0.0s
 => CACHED [build 3/7] COPY pom.xml pom.xml                                                                                                                  0.0s
 => CACHED [build 4/7] RUN mvn dependency:go-offline -B                                                                                                      0.0s
 => CACHED [build 5/7] COPY src src                                                                                                                          0.0s
 => CACHED [build 6/7] RUN mvn package -DskipTests                                                                                                           0.0s
 => CACHED [build 7/7] RUN mkdir -p target/dependency && (cd target/dependency; jar -xf ../*.jar)                                                            0.0s
 => CACHED [stage-1 2/4] COPY --from=build /workspace/app/target/dependency/BOOT-INF/lib /app/lib                                                            0.0s
 => CACHED [stage-1 3/4] COPY --from=build /workspace/app/target/dependency/META-INF /app/META-INF                                                           0.0s
 => CACHED [stage-1 4/4] COPY --from=build /workspace/app/target/dependency/BOOT-INF/classes /app                                                            0.0s
 => exporting to image                                                                                                                                       0.0s
 => => exporting layers                                                                                                                                      0.0s
 => => writing image sha256:0969a65603a2acdedea334eefe6582f07deb2b811d925cbdb1a0108d9fe01663                                                                 0.0s
 => => naming to docker.io/library/metadata-service                                                                                                          0.0s
```

Start the container from the image using `docker run -p 8080:8080 -d --name mds metadata-service`

Ensure that the container is running using the command : `docker logs mds`.

Visit `http://localhost:8080/actuator/info` to see the info endpoint output.

```json
{
    app: {
        name: "Metadata Service",
        description: "Metadata service also known as config service. It hold the metadata/config required across different services.",
        version: "1.0.0"
    }
}
```

Visit `http://localhost:8080/actuator/health` to see the health endpoint ouput.

```json
{
    status: "UP"
}
```

Thus we can leverage multi-stage builds.

## Tags

Tags are used to version docker images. The namespace and the image name form the REPOSITORY part of the docker image.

`gcr.io/k8s-minikube/kicbase` - `gcr.io/k8s-minikube` - namespace and `kicbase` - image name. Version `v0.0.27`.

While building we can specify the image version as shown below:

`docker build -t hello-world-node.js:V1.0.0 .`

Once the build is complete, run `docker images` to see the new version.

```
REPOSITORY                    TAG       IMAGE ID       CREATED          SIZE
metadata-service              latest    0969a65603a2   24 minutes ago   127MB
hello-world-node.js           V1.0.0    2868d180e4dd   4 hours ago      121MB
hello-world-node.js           latest    2868d180e4dd   4 hours ago      121MB
mynginx                       latest    2ee2f0e46764   2 weeks ago      133MB
nginx                         latest    f8f4ffc8092c   3 weeks ago      133MB
hello-world                   latest    feb5d9fea6a5   3 weeks ago      13.3kB
gcr.io/k8s-minikube/kicbase   v0.0.27   9fa1cc16ad6d   4 weeks ago      1.08GB
busybox                       latest    16ea53ea7c65   5 weeks ago      1.24MB
```

To tag an image to a namespace use `docker tag` as shown below:

`docker tag hello-world-node.js:V1.0.0 sriharisridharan/hello-world-node.js:V1.0.0`

The change can be viewed by running `docker images`

```
REPOSITORY                              TAG       IMAGE ID       CREATED          SIZE
metadata-service                        latest    0969a65603a2   28 minutes ago   127MB
hello-world-node.js                     V1.0.0    2868d180e4dd   4 hours ago      121MB
hello-world-node.js                     latest    2868d180e4dd   4 hours ago      121MB
sriharisridharan/hello-world-node.js   V1.0.0    2868d180e4dd   4 hours ago      121MB
mynginx                                 latest    2ee2f0e46764   2 weeks ago      133MB
nginx                                   latest    f8f4ffc8092c   3 weeks ago      133MB
hello-world                             latest    feb5d9fea6a5   3 weeks ago      13.3kB
gcr.io/k8s-minikube/kicbase             v0.0.27   9fa1cc16ad6d   4 weeks ago      1.08GB
busybox                                 latest    16ea53ea7c65   5 weeks ago      1.24MB
```

You can append the Git commit SHA to the version as shown below:

```shell
export GIT_COMMIT_SHA=$(git log -1 --format=%h)
echo $GIT_COMMIT_SHA
```

The `echo` prints the latest hash. The image can be built using the command:

`docker build -t sriharisridharan/hello-world-node.js:V1.0.0-$GIT_COMMIT_SHA .`

```
[+] Building 4.3s (9/9) FINISHED
 => [internal] load build definition from Dockerfile                                                                                                       0.0s
 => => transferring dockerfile: 376B                                                                                                                       0.0s
 => [internal] load .dockerignore                                                                                                                          0.0s
 => => transferring context: 56B                                                                                                                           0.0s
 => [internal] load metadata for docker.io/library/openjdk:8-jdk-alpine                                                                                    3.7s
 => [internal] load build context                                                                                                                          0.5s
 => => transferring context: 24.60MB                                                                                                                       0.5s
 => [1/4] FROM docker.io/library/openjdk:8-jdk-alpine@sha256:94792824df2df33402f201713f932b58cb9de94a0cd524164a0f2283343547b3                              0.0s
 => CACHED [2/4] ADD target/app/BOOT-INF/lib /app/lib                                                                                                      0.0s
 => CACHED [3/4] ADD target/app/META-INF /app/META-INF                                                                                                     0.0s
 => CACHED [4/4] ADD target/app/BOOT-INF/classes /app                                                                                                      0.0s
 => exporting to image                                                                                                                                     0.0s
 => => exporting layers                                                                                                                                    0.0s
 => => writing image sha256:a074e23a273a5e778cdc9cdbe094f867369cc0c1351183c0ec7aac9c533fd646                                                               0.0s
 => => naming to docker.io/sriharisridharan/hello-world-node.js:V1.0.0-5e98b75                                                                            0.0s
```

Run `docker images` to see the image.

```
REPOSITORY                              TAG              IMAGE ID       CREATED          SIZE
metadata-service                        latest           0969a65603a2   35 minutes ago   127MB
sriharisridharan/hello-world-node.js   V1.0.0-5e98b75   a074e23a273a   3 hours ago      129MB
sriharisridharan/hello-world-node.js   V1.0.0           2868d180e4dd   4 hours ago      121MB
hello-world-node.js                     V1.0.0           2868d180e4dd   4 hours ago      121MB
hello-world-node.js                     latest           2868d180e4dd   4 hours ago      121MB
```

> **NOTE:** We can leverage tags to keep promoting images from sit->qa->uat->prod, etc.

### Pushing images to docker hub

Run `docker login` to login from the command line before pushing the image.

Create a repository in https://hub.docker.com.

Run `docker push sriharisridharan/hello-world-node.js:V1.0.0-5e98b75`. (**Note:** You need to enter the namespace name and version tag as in your case. Run `docker images` to get the details if you are following along!)

```
The push refers to repository [docker.io/sriharisridharan/hello-world-node.js]
98c5f5531661: Pushed 
d2cc00fc1215: Pushed 
c8bd21067cd0: Pushed 
88f7f9127f91: Pushed 
20e664c3d99e: Mounted from library/node 
b3031b5001d5: Mounted from library/node 
a303372b2caa: Mounted from library/node 
39982b2a789a: Mounted from library/node 
V1.0.0-5e98b75: digest: sha256:6f0ae72ef55b5013976e4e83c64dbbce854feb2703ecbaaf5329b800c1914aaa size: 1994
```

Refer: `https://docs.docker.com/develop/develop-images/dockerfile_best-practices/` for more information on Dockerfile best practices.
