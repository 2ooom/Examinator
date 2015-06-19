﻿using System.Collections.Generic;
using TypeLite;

namespace Examinator.Contract
{
    [TsClass]
    public class Category : Paragraph<int>
    {
        public Category()
        {
            Text = string.Empty;
            Questions = new List<Question>();
        }
        public IList<Question> Questions { get; set; }
    }
}
