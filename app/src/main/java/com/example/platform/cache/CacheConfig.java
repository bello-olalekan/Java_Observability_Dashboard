package com.example.platform.cache;

import net.rubyeye.xmemcached.MemcachedClient;
import net.rubyeye.xmemcached.XMemcachedClientBuilder;
import net.rubyeye.xmemcached.utils.AddrUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;

@Configuration
public class CacheConfig {
    @Bean
    MemcachedClient memcachedClient(
            @Value("${app.memcached.host:localhost}") String host,
            @Value("${app.memcached.port:11211}") int port) throws IOException {
        XMemcachedClientBuilder builder = new XMemcachedClientBuilder(
                AddrUtil.getAddresses(host + ":" + port));
        return builder.build();
    }
}
