// Classe Subjects - implementado de acordo com o primeiro diagrama de classe
public class Subjects
{
    public int ID { get; set; }
    public string SubjectName { get; set; }
    private Teacher SubjectTeacher { get; set; }

    public void SetTeacher(Teacher teacher)
    {
        // Falta implementar essa logica aqui
        SubjectTeacher = teacher;
    }
}