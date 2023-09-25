package net.bestcompany.foliowatch.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import net.bestcompany.foliowatch.models.User;

public interface UserRepository extends MongoRepository<User, String> {
    Boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);
}
