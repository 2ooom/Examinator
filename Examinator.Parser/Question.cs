using System.Collections.Generic;

namespace Examinator.Parser
{
    public class Question : Paragraph
    {
        public string CategoryId { get; set; }
        public IList<Answer> Answers { get; set; }
    }
}
