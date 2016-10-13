package pl.iis.paw.trello.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.iis.paw.trello.domain.User;
import pl.iis.paw.trello.service.UserService;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

@RestController
public class UserController {

    private UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @RequestMapping(value = "/users", method = RequestMethod.GET)
    public ResponseEntity<?> getUsers(Pageable pageable) {
        return ResponseEntity.ok(userService.getUsers(pageable));
    }
    
    @RequestMapping(value = "/users/me", method = RequestMethod.GET)
    public ResponseEntity<?> getCurrentUser() {
        return getUser(1L);
    }

    @RequestMapping(value = "/users/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> getUser(@PathVariable(value = "id") Long userId) {
        return ResponseEntity.ok(userService.findUserById(userId));
    }

    @RequestMapping(value = "/users", method = RequestMethod.POST)
    public ResponseEntity<?> createUser(@Valid @RequestBody User user) throws URISyntaxException {
        return ResponseEntity
            .created(new URI("/users/" + user.getId()))
            .body(userService.addUser(user));
    }

    @RequestMapping(value = "/users", method = RequestMethod.PUT)
    public ResponseEntity<?> updateUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.updateUser(user));
    }

    @RequestMapping(value = "/users/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }
}
