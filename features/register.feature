Feature: User Registration

  Scenario: Successfully register a new user
    Given I am a new user with valid registration details
    When I send a POST request to "/api/v1/auth/register"
    Then I should receive a 201 status code
    And I should see the message "User registered successfully"