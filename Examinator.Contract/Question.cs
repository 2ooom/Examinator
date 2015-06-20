using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using TypeLite;

namespace Examinator.Contract
{
    [TsClass]
    public class Question : Paragraph
    {
        public int CategoryId { get; set; }

        public int Correct { get { return Answers.Count(t => t.IsRight.HasValue && t.IsRight.Value); } }
        public IList<Answer> Answers { get; set; }

        public Question()
        {
            Text = string.Empty;
            Answers = new List<Answer>();
        }

        [JsonIgnore, TsIgnore]
        public bool IsNew
        {
            get { return Id == 0; }
        }
    }
}
