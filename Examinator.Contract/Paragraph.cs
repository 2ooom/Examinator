using Newtonsoft.Json;
using TypeLite;

namespace Examinator.Contract
{
    [TsClass]
    public class Paragraph
    {
        public string Id { get; set; }
        
        public string Text { get; set; }
        
        public string ImageUrl { get; set; }

        [JsonIgnore, TsIgnore]
        public bool IsNew => string.IsNullOrEmpty(Id);
    }
}
