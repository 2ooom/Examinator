using Newtonsoft.Json;

namespace Examinator.Parser
{
    public class Paragraph
    {
        public string Id { get; set; }
        public string Text { get; set; }
        public string ImageUrl { get; set; }

        [JsonIgnore]
        public bool IsNew => string.IsNullOrEmpty(Id);
    }
}
