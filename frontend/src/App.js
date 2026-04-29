import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const API = "http://localhost:5001/api";

  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [posts, setPosts] = useState([]);
  const [postTitle, setPostTitle] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const [studentName, setStudentName] = useState("");
  const [courseName, setCourseName] = useState("");

  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  // ===== USER CRUD =====
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/user`);
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const addUser = async () => {
    if (!name.trim()) {
      alert("Please enter a name");
      return;
    }
    try {
      if (editingId) {
        await axios.put(`${API}/user/${editingId}`, { name });
        setEditingId(null);
      } else {
        await axios.post(`${API}/user`, { name });
      }
      setName("");
      fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const editUser = (user) => {
    setName(user.name);
    setEditingId(user._id);
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${API}/user/${id}`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName("");
  };

  // ===== ONE TO MANY =====
  const addPost = async () => {
    if (!postTitle.trim() || !selectedUser) {
      alert("Please select a user and enter a post title");
      return;
    }
    try {
      await axios.post(`${API}/post`, {
        title: postTitle,
        userId: selectedUser
      });
      setPostTitle("");
      setSelectedUser("");
      fetchPosts();
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API}/post`);
      setPosts(res.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // ===== MANY TO MANY =====
  const addStudent = async () => {
    if (!studentName.trim()) {
      alert("Please enter a student name");
      return;
    }
    try {
      await axios.post(`${API}/student`, { name: studentName });
      setStudentName("");
      fetchStudents();
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  const addCourse = async () => {
    if (!courseName.trim()) {
      alert("Please enter a course name");
      return;
    }
    try {
      await axios.post(`${API}/course`, { title: courseName });
      setCourseName("");
      fetchCourses();
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  const enroll = async () => {
    if (!selectedStudent || !selectedCourse) {
      alert("Please select both a student and a course");
      return;
    }
    try {
      await axios.post(`${API}/enroll`, {
        studentId: selectedStudent,
        courseId: selectedCourse
      });
      setSelectedStudent("");
      setSelectedCourse("");
      fetchStudents();
      fetchCourses();
    } catch (error) {
      console.error("Error enrolling:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API}/student`);
      setStudents(res.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API}/course`);
      setCourses(res.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchPosts();
    fetchStudents();
    fetchCourses();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1> MERN CRUD + Relationships</h1>

      {/* USER CRUD */}
      <h2>👤 User CRUD</h2>
      <div style={{ marginBottom: "20px" }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
          style={{ padding: "8px", marginRight: "10px" }}
        />
        <button onClick={addUser} style={{ padding: "8px 15px", marginRight: "10px" }}>
          {editingId ? "Update" : "Add"}
        </button>
        {editingId && (
          <button onClick={cancelEdit} style={{ padding: "8px 15px" }}>
            Cancel
          </button>
        )}
      </div>

      <div style={{ marginBottom: "30px" }}>
        {users.map((u) => (
          <div
            key={u._id}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              margin: "8px 0",
              borderRadius: "5px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <strong>{u.name}</strong>
            <div>
              <button onClick={() => editUser(u)} style={{ marginRight: "10px", padding: "5px 10px" }}>
                Edit
              </button>
              <button onClick={() => deleteUser(u._id)} style={{ padding: "5px 10px" }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ONE TO MANY */}
      <h2> One-to-Many (User → Posts)</h2>
      <div style={{ marginBottom: "20px" }}>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          style={{ padding: "8px", marginRight: "10px" }}
        >
          <option value="">Select User</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name}
            </option>
          ))}
        </select>
        <input
          placeholder="Post Title"
          value={postTitle}
          onChange={(e) => setPostTitle(e.target.value)}
          style={{ padding: "8px", marginRight: "10px" }}
        />
        <button onClick={addPost} style={{ padding: "8px 15px" }}>
          Add Post
        </button>
      </div>

      <div style={{ marginBottom: "30px" }}>
        {posts.map((p) => (
          <div key={p._id} style={{ border: "1px solid #ddd", padding: "10px", margin: "8px 0" }}>
            <strong>{p.title}</strong> → {p.userId?.name || "Unknown"}
          </div>
        ))}
      </div>

      {/* MANY TO MANY */}
      <h2> Many-to-Many (Students ↔ Courses)</h2>
      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Student Name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          style={{ padding: "8px", marginRight: "10px" }}
        />
        <button onClick={addStudent} style={{ padding: "8px 15px", marginRight: "10px" }}>
          Add Student
        </button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Course Name"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          style={{ padding: "8px", marginRight: "10px" }}
        />
        <button onClick={addCourse} style={{ padding: "8px 15px" }}>
          Add Course
        </button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          style={{ padding: "8px", marginRight: "10px" }}
        >
          <option value="">Select Student</option>
          {students.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          style={{ padding: "8px", marginRight: "10px" }}
        >
          <option value="">Select Course</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.title}
            </option>
          ))}
        </select>

        <button onClick={enroll} style={{ padding: "8px 15px" }}>
          Enroll
        </button>
      </div>

      <h3>Students</h3>
      <div style={{ marginBottom: "30px" }}>
        {students.map((s) => (
          <div key={s._id} style={{ border: "1px solid #ddd", padding: "10px", margin: "8px 0" }}>
            <strong>{s.name}</strong> → {s.courses?.map((c) => c.title).join(", ") || "No courses"}
          </div>
        ))}
      </div>

      <h3>Courses</h3>
      <div>
        {courses.map((c) => (
          <div key={c._id} style={{ border: "1px solid #ddd", padding: "10px", margin: "8px 0" }}>
            <strong>{c.title}</strong> → {c.students?.map((s) => s.name).join(", ") || "No students"}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;


