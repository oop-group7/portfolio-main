package net.bestcompany.foliowatch.security.services;

import java.util.Calendar;
import java.util.HashSet;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.servlet.http.HttpServletRequest;
import net.bestcompany.foliowatch.models.ERole;
import net.bestcompany.foliowatch.models.PasswordResetToken;
import net.bestcompany.foliowatch.models.Role;
import net.bestcompany.foliowatch.models.User;
import net.bestcompany.foliowatch.models.VerificationToken;
import net.bestcompany.foliowatch.payload.request.SignupRequest;
import net.bestcompany.foliowatch.repository.PasswordTokenRepository;
import net.bestcompany.foliowatch.repository.RoleRepository;
import net.bestcompany.foliowatch.repository.UserRepository;
import net.bestcompany.foliowatch.repository.VerificationTokenRepository;

@Service
@Transactional
public class UserService implements IUserService {
    @Autowired
    private VerificationTokenRepository tokenRepository;

    @Autowired
    private PasswordTokenRepository passwordTokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private IRefreshTokenService tokenService;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public TokenState validateVerificationToken(String token) {
        Optional<VerificationToken> rawVerificationToken = tokenRepository.findByToken(token);
        if (rawVerificationToken.isEmpty()) {
            return TokenState.TokenInvalid;
        }
        VerificationToken verificationToken = rawVerificationToken.get();
        User user = verificationToken.getUser();
        Calendar cal = Calendar.getInstance();
        if ((verificationToken.getExpiryDate().getTime() - cal.getTime().getTime()) <= 0) {
            tokenRepository.delete(verificationToken);
            return TokenState.TokenExpired;
        }
        user.setEnabled(true);
        userRepository.save(user);
        tokenRepository.delete(verificationToken);
        return TokenState.TokenValid;
    }

    @Override
    public VerificationToken generateNewVerificationToken(String existingVerificationToken)
            throws NoSuchElementException {
        VerificationToken vToken = tokenRepository.findByToken(existingVerificationToken).orElseThrow();
        vToken.updateToken(UUID.randomUUID().toString());
        vToken = tokenRepository.save(vToken);
        return vToken;
    }

    @Override
    public Optional<User> getUserByVerificationToken(String verificationToken) {
        return tokenRepository.findByToken(verificationToken).map(token -> token.getUser());
    }

    @Override
    public Optional<User> findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public void createPasswordResetTokenForUser(User user, String token) {
        PasswordResetToken myToken = new PasswordResetToken(token, user);
        passwordTokenRepository.save(myToken);
    }

    @Override
    public Optional<User> getUserByPasswordResetToken(String token) {
        return passwordTokenRepository.findByToken(token).map(t -> t.getUser());
    }

    @Override
    public void changeUserPassword(User user, String password) {
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
    }

    @Override
    public boolean checkIfValidOldPassword(User user, String oldPassword) {
        return passwordEncoder.matches(oldPassword, user.getPassword());
    }

    @Override
    public void deleteUser(User user) {
        userRepository.delete(user);
        tokenService.deleteTokenByUser(user);
        tokenRepository.deleteByUser(user);
        passwordTokenRepository.deleteByUser(user);
    }

    @Override
    public void updateUser(User user) {
        userRepository.save(user);
    }

    @Override
    public User registerNewUserAccount(SignupRequest request, HttpServletRequest httpInfo) throws Exception {
        if (emailExists(request.getEmail())) {
            throw new Exception("Email is already in use!");
        }
        User user = new User(request.getFirstName(), request.getUsername(),
                request.getEmail(),
                encoder.encode(request.getPassword()));
        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new Exception("Role is not found."));
        Set<Role> roles = new HashSet<>();
        roles.add(userRole);
        user.setRoles(roles);
        userRepository.save(user);
        return user;
    }

    private boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }
}
