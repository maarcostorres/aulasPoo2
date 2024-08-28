// Classe Groups - implementado de acordo com o primeiro diagrama de classe
public class Groups
{
    public int ID { get; set; }
    public string GroupName { get; set; }
    private List<Teacher> Teachers { get; set; } = new List<Teacher>();
    private List<Student> Students { get; set; } = new List<Student>();

    public void AddTeacher(Teacher teacher)
    {
        // Falta implementar essa logica aqui
        Teachers.Add(teacher);
    }

    public void AddStudent(Student student)
    {
        // Falta implementar essa logica aqui
        Students.Add(student);
    }
}
