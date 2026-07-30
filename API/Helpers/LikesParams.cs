namespace API.Helpers
{
    public class LikesParams : PagingParms
    {
        public string MemberId {get; set;} = "";
        public string Predicate {get; set;} = "liked";
    }
}