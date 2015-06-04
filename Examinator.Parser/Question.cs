﻿using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;

namespace Examinator.Parser
{
    public class Question : Paragraph
    {
        public string CategoryId { get; set; }
        public string SubCategoryId { get; set; }

        [JsonIgnore]
        public int CorrectAnswersNumber { get { return Answers.Count(t => t.IsRight); } }
        public IList<Answer> Answers { get; set; }

        public Question()
        {
            Text = string.Empty;
            CategoryId = string.Empty;
            Answers = new List<Answer>();
        }
    }
}
