using System.IO;
using iTextSharp.text;
using iTextSharp.text.pdf;
using Newtonsoft.Json;

namespace Examinator.Parser
{
    class Program
    {
        static void Main(string[] args)
        {
            // Step 1. Add verticla lines
            AddBorders("Source/cars.pdf", "Source/bordered_cars.pdf");

            // Step 2. Generate Xsls. Online
            // http://smallpdf.com/pdf-to-excel

            // Step 3. Parse table
            var parser = new CarsParser();
            var questions = parser.Parse("Source/cars.xlsx");

            // Step 4. Serialize to json
            using (var stream = new StreamWriter("cars.json", false))
            {
                var outputStr = JsonConvert.SerializeObject(questions);
                
                stream.Write(outputStr);
            }
        }

        //Working with Image
        private static void AddBorders(string input, string output)
        {
            var doc = new Document();
            var reader = new PdfReader(new FileStream(input, FileMode.Open));
            using (var writeStream = new FileStream(output, FileMode.Create))
            {
                var writer = PdfWriter.GetInstance(doc, writeStream);
                using (var stamper = new PdfStamper(reader, writeStream))
                {
                    for (var page = 2; page <= reader.NumberOfPages; page ++)
                    {
                        var cb = stamper.GetOverContent(page);

                        const int marginH = 22;
                        const int marginW = 16;
                        const int col1 = 68;
                        const int col2 = 173;
                        const int col3 = 20;
                        cb.Rectangle(marginW, marginH, doc.PageSize.Width - marginW * 2 - 7, doc.PageSize.Height - marginH * 2);
                        cb.Stroke();
                        cb.Rectangle(marginW, marginH, col1, doc.PageSize.Height - marginH * 2);
                        cb.Stroke();
                        cb.Rectangle(marginW + col1, marginH, col2, doc.PageSize.Height - marginH * 2);
                        cb.Stroke();
                        cb.Rectangle(marginW + col1 + col2, marginH, col3, doc.PageSize.Height - marginH * 2);
                        cb.Stroke();
                    }
                    stamper.Close();
                }
                reader.Close();
                writer.Close();
            }
        }
    }
}
