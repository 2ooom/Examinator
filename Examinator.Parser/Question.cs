using System.Collections.Generic;
using System.Linq;

namespace Examinator.Parser
{
    public class Question : Paragraph
    {
        public string CategoryId { get; set; }
        public string SubCategoryId { get; set; }
        public int CorrectAnswersNumber { get { return Answers.Count(t => t.IsRight); } }
        public IList<Answer> Answers { get; set; }

        public Question()
        {
            Text = string.Empty;
            Answers = new List<Answer>();
        }
    }
}
