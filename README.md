# STOMP(Simple Text oriented Message)
stomp이용한 간단한 채팅예제

## STOMP는??
- 메시지 전송을 효율적으로 하기 위해 탄생한 프로토콜
- WebSocket 위에 동작하는 프로토콜로 클라이언트와 서버가 전송할 메시지, 유형. 형식, 내용을 정의
- pub/sub 구조로 되어있어 메시지를 전송하고 처리하는 부분이 확실히 정해져있다.

    > pub/sub : 메시지를 보내는 주체와 받는 주체를 분리해 제공하는 메시징 방법

![사진](https://docs.spring.io/spring-framework/docs/current/reference/html/images/message-flow-broker-relay.png)

## pub/sub 메시징 흐름
1. 클라이언트에서 메시지를 보내면 @MessageMapping이 붙은 Controller가 받는다
2. /topic을 destination 헤더로 넣어 바로 메시지를 송신할 수 있고 /app 경로로 넣으면 서버 내에서 가공할 수 있다
3. 서버가 가공을 완료하면 메시지를 /topic이란 경로에 담아 StompBroker에게 전달
4. 전달받은 메시지를 최종적으로 전달하게 된다

## STOMP의 장점
- Messaging Protocol을 만들고 메시지 형식을 커스터마이징 할 필요가 없다.
- RabbitMQ, ActiveMQ, Kafka같은 Message Broker를 이용해 Sub를 관리하고 메시지를 브로드캐스팅 할 수 있다

  > Message Broker : 발신자의 메시지를 받아 수신자들에게 메시지를 전달하는 역할
- WebSocket 기반으로 각 연결마다 WebSocketHandler를 구현하는 것보다 @Controller된 객체를 이용해 조직적으로 관리할 수 있다
