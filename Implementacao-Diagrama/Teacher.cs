// Classe Teacher - implementado de acordo com o primeiro diagrama de classe
public class Teacher
{
    public int ID { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    private List<Subjects> SubjectsList { get; set; } = new List<Subjects>();

    public void AddSubject(Subjects subject)
    {
        // Falta implementar essa logica aqui
        SubjectsList.Add(subject);
    }
}