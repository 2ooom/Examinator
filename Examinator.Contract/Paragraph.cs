using TypeLite;

namespace Examinator.Contract
{
    [TsClass]
    public class Paragraph
    {
        public int Id { get; set; }
        
        public string Text { get; set; }
        
        public string ImageUrl { get; set; }
    }
}
