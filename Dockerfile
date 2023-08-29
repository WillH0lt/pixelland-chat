FROM golang:1.19-alpine as go-build

WORKDIR /build

COPY ./go.mod ./
COPY ./go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build

FROM scratch
WORKDIR /app
COPY --from=go-build /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
COPY --from=go-build /build/assets assets
COPY --from=go-build /build/pixelland-chat pixelland-chat

CMD ["/app/pixelland-chat"]
