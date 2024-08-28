// Classe Student - implementado de acordo com o primeiro diagrama de classe
public class Student
{
    public int ID { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    private List<Marks> MarksList { get; set; } = new List<Marks>();

    public void AddStudent()
    {
        // Falta implementar essa logica aqui
    }

    public double CalculateAverage()
    {
        if (MarksList.Count == 0) return 0;

        double sum = MarksList.Sum(m => m.Mark);
        return sum / MarksList.Count;
    }

    public void AddMark(Marks mark)
    {
        // Falta implementar essa logica aqui
        MarksList.Add(mark);
    }
}