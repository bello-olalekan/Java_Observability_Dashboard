package com.example.platform;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import net.rubyeye.xmemcached.MemcachedClient;

@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:h2:mem:testdb;MODE=PostgreSQL;DB_CLOSE_DELAY=-1",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "app.memcached.host=localhost"
})
class PlatformApplicationTests {
    @MockBean
    MemcachedClient memcachedClient;

    @Test
    void contextLoads() {
    }
}
