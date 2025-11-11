namespace EventOrganizerAPI.DTOs.Auth
{
    public class ResetPasswordByCodeRequestDto
    {
        public string Email { get; set; }
        public string Code { get; set; }
        public string NewPassword { get; set; }
    }
}