using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using TypeLite;

namespace Examinator.Contract
{
    [TsClass]
    public class Question : Paragraph<string>
    {
        public string CategoryId { get; set; }
        public string SubCategoryId { get; set; }

        public int CorrectAnswersNumber { get { return Answers.Count(t => t.IsRight); } }
        public IList<Answer> Answers { get; set; }

        public Question()
        {
            Text = string.Empty;
            CategoryId = string.Empty;
            Answers = new List<Answer>();
        }

        [JsonIgnore, TsIgnore]
        public bool IsNew
        {
            get { return string.IsNullOrEmpty(Id); }
        }
    }
}
