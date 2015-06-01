using System.IO;
using HtmlAgilityPack;
using Newtonsoft.Json;

namespace Examinator.Parser
{
    class Program
    {
        static void Main(string[] args)
        {
            var source = args.Length > 0? args[0] : "Source/cars.htm";
            var output = args.Length > 1? args[1] : "cars.json";
            var doc = new HtmlDocument();
            doc.Load(source);
            var parser = new SourceParser();
            var questions = parser.Parse(doc);
            
            using (var stream = new StreamWriter(output, false))
            {
                var outputStr = JsonConvert.SerializeObject(questions);
                stream.Write(outputStr);
            }
        }
    }
}
