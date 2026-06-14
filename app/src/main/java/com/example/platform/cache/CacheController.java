package com.example.platform.cache;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import net.rubyeye.xmemcached.MemcachedClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/cache")
class CacheController {
    private final MemcachedClient client;

    CacheController(MemcachedClient client) {
        this.client = client;
    }

    @GetMapping("/{key}")
    ResponseEntity<Map<String, Object>> get(@PathVariable String key) throws Exception {
        Object value = client.get(key);
        if (value == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(Map.of("key", key, "value", value));
    }

    @PutMapping("/{key}")
    Map<String, Object> put(@PathVariable String key, @Valid @RequestBody CachePutRequest request) throws Exception {
        client.set(key, request.ttlSeconds(), request.value());
        return Map.of("key", key, "value", request.value(), "ttlSeconds", request.ttlSeconds());
    }

    record CachePutRequest(@NotBlank String value, int ttlSeconds) {
        CachePutRequest {
            if (ttlSeconds <= 0) {
                ttlSeconds = 300;
            }
        }
    }
}
