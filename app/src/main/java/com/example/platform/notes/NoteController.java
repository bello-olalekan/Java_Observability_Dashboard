package com.example.platform.notes;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/notes")
class NoteController {
    private final NoteRepository repository;

    NoteController(NoteRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    List<NoteResponse> list() {
        return repository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(NoteResponse::from)
                .toList();
    }

    @PostMapping
    NoteResponse create(@Valid @RequestBody CreateNoteRequest request) {
        Note note = repository.save(new Note(request.title(), request.body()));
        return NoteResponse.from(note);
    }

    record CreateNoteRequest(
            @NotBlank @Size(max = 120) String title,
            @NotBlank @Size(max = 2000) String body) {
    }

    record NoteResponse(Long id, String title, String body, Instant createdAt) {
        static NoteResponse from(Note note) {
            return new NoteResponse(note.getId(), note.getTitle(), note.getBody(), note.getCreatedAt());
        }
    }
}
