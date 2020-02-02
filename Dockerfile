FROM golang:latest

MAINTAINER Marc Pratllusà "muilpp@gmail.com"

ARG LASTFM_KEY
ARG SONGKICK_KEY
WORKDIR /usr/src/concerts
EXPOSE 8282 80
USER root
RUN git clone https://github.com/muilpp/concert-schedules.git
RUN cd concert-schedules; go get github.com/gin-contrib/cors; go get github.com/gin-gonic/gin; go build
RUN chmod -R a+X /usr/src/concerts/concert-schedules
RUN cd concert-schedules; echo $LASTFM_KEY > LastFMApiKey.txt
RUN cd concert-schedules; echo $SONGKICK_KEY > SongKickApiKey.txt
CMD cd concert-schedules; ./concert-schedules
