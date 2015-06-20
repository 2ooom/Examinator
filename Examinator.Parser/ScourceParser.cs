using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using Examinator.Contract;
using LinqToExcel;

namespace Examinator.Parser
{
    public class ScourceParser
    {
        public string ImagesPath { get; set; }
        public string OutputPath { get; set; }

        public IEnumerable<Category> Parse(string inputXlsx)
        {
            var excel = new ExcelQueryFactory(inputXlsx);
            var proxies = (from c in excel.Worksheet<SourceProxy>("Cars") select c).ToList();
            
            var question = new Question();
            var rightAnswers = 0;
            var categoryName = string.Empty;
            var categories = new List<Category>();

            foreach (var proxy in proxies)
            {
                var id = proxy.Id?.Trim() ?? string.Empty;
                var text = proxy.Text?.Trim() ?? string.Empty;
                if (!string.IsNullOrEmpty(id))
                {
                    var matches = 0;
                    // Question Id
                    if (Regex.IsMatch(id, "\\d{4,}", RegexOptions.IgnoreCase))
                    {
                        if (!question.IsNew)
                        {
                            question = PushQuestion(categories, question, rightAnswers, categoryName);
                            rightAnswers = 0;
                            categoryName = string.Empty;;
                        }
                        question.Id = int.Parse(Regex.Match(id, "(\\d{4,})", RegexOptions.IgnoreCase).Groups[1].Value);
                        CheckQuestionImage(question);
                        matches++;
                    }
                    // SubCategory Id
                    if (Regex.IsMatch(id, "CARS\\s*\\d+\\.\\d+", RegexOptions.IgnoreCase))
                    {
                        matches++;
                        question.SubCategoryId = Regex.Match(id, "(CARS\\s*\\d{1,}\\.\\d{1,})", RegexOptions.IgnoreCase).Groups[1].Value; 
                    }
                    // Correct answers counter
                    if (Regex.IsMatch(id, "MARK\\s\\d+\\sANSWER", RegexOptions.IgnoreCase))
                    {
                        matches++;
                        rightAnswers = int.Parse(Regex.Match(id, "MARK\\s(\\d+)\\sANSWER", RegexOptions.IgnoreCase).Groups[1].Value);
                    }
                    // Accumulate category name
                    if (matches == 0 || matches == 3)
                    {
                        if (matches == 0)
                        {
                            categoryName += " " + id;
                        }
                        else
                        {
                            categoryName = Regex.Match(id, "\\n(.+)[\\n|\\s]MARK", RegexOptions.IgnoreCase).Groups[1].Value;
                        }
                    }
                }
                if (!string.IsNullOrEmpty(text))
                {
                    question.Text = $"{question.Text} {text}";
                }
                var answer = GetAnswer(proxy, question);
                if (answer != null)
                {
                    question.Answers.Add(answer);
                }
            }
            PushQuestion(categories, question, rightAnswers, categoryName);
            
            Console.WriteLine();
            
            foreach (var c in categories)
            {
                Console.WriteLine("Category [{0}] with [{1}] questions", c.Text, c.Questions.Count);
            }
            Test(categories);
            return categories;
        }

        private void CheckQuestionImage(Question question)
        {
            var filename = $"{question.Id}.png";
            var path = Path.Combine(ImagesPath, filename);
            if (File.Exists(path))
            {
                question.ImageUrl = path;
            }
        }

        private static void Test(List<Category> categories)
        {
            try
            {
                var testData = GetQuestionsByCategoryCheck();
                var total = testData.Sum(t => t.Value);
                var actualTotal = categories.Sum(t => t.Questions.Count);
                if (total != actualTotal)
                {
                    Console.WriteLine("Total questions number expected [{0}] but was [{1}]", total, actualTotal);
                }
                foreach (var category in categories)
                {
                    var count = testData[category.Text];
                    if (category.Questions.Count != count)
                    {
                        Console.WriteLine("Total questions expected in [{0}] is [{1}] but was [{2}]", category.Text, count, category.Questions.Count);
                    } 
                }
                Console.WriteLine("Test Passed");
            }
            catch (Exception)
            {
                Console.WriteLine("Test failed unexpectedly");
                throw;
            }
        }

        private static Dictionary<string, int> GetQuestionsByCategoryCheck()
        {
            return new Dictionary<string, int>
            {
                {"ALERTNESS", 24 },
                {"ATTITUDE", 30 },
                {"SAFETY AND YOUR VEHICLE", 45 },
                {"SAFETY MARGINS", 29 },
                {"HAZARD AWARENESS", 29 },
                {"VULNERABLE ROAD USERS", 61 },
                {"OTHER TYPE OF VEHICLES", 19 },
                {"VEHICLE HANDLING", 37 },
                {"DUAL CARRIAGEWAY RULES", 11 },
                {"RULES OF THE ROAD", 45 },
                {"ROAD AND TRAFFIC SIGNS", 71 },
                {"DOCUMENTS", 11 },
                {"ACCIDENTS", 27 },
                {"VEHICLE LOADING", 5 },
            };
        }

        private static Question PushQuestion(List<Category> categories, Question question, int rightAnswers, string categoryName)
        {
            var text = categoryName.Trim().Replace("\n", " ");
            var existing = categories.FirstOrDefault(t => t.Text == text);
            if (existing == null)
            {
                existing = new Category {Id = categories.Count + 1, Text = text};
                categories.Add(existing);
            }
            existing.Questions.Add(question);
            if (question.Correct != rightAnswers)
            {
                Console.WriteLine(" [-] Question [{0}] is expected to have [{1}] correct answers but parsed [{2}]",
                    question.Id, rightAnswers, question.Correct);
            }
            return new Question();
        }

        private Answer GetAnswer(SourceProxy proxy, Question question)
        {
            var answer = new Answer
            {
                Id = question.Answers.Count + 1,
                Text = proxy.AnswerText
            };
            if (!string.IsNullOrEmpty(proxy.AnswerIsRight) && proxy.AnswerIsRight.Trim().Length > 0)
            {
                answer.IsRight = true;
            }
            var filename = $"{question.Id}.{answer.Id}.png";
            var path = Path.Combine(ImagesPath, filename);
            if (File.Exists(path))
            {
                answer.ImageUrl = path;
            }

            if (string.IsNullOrEmpty(proxy.AnswerText) && string.IsNullOrEmpty(answer.ImageUrl))
            {
                return null;
            }
            return answer;
        }
    }

    public class SourceProxy
    {
        public string Id { get; set; }
        public string Text { get; set; }
        public string AnswerIsRight { get; set; }
        public string AnswerText { get; set; }
    }
}
