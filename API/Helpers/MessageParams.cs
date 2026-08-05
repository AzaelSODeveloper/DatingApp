using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers
{
    public class MessageParams : PagingParms
    {
        public string? MemberId { get; set; }
        public string Container { get; set; } = "Default";
    }
}