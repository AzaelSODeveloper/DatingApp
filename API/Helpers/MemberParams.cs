namespace API.Helpers
{
    public class MemberParams : PagingParms
    {
        public string? Gender {get; set;}   
        public string? CurrentMemberId {get; set;}   

        public int minAge {get; set;} = 18;
        public int maxAge {get; set;} = 100;
        public string OrderBy { get; set; } = "lastActive";
    }
}