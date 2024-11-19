document.querySelector(".form").addEventListener("submit", async function (event) {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username && password) {
    try {
      const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const result = await response.json();
        swal("Success!", "Login successful.", "success").then(() => {
          window.location.href = "../screens/homepage.html";
        });
      } else {
        swal("Opps!", "Wrong username or password.", "error");
      }
    } catch (error) {
      console.error('Error:', error);
      swal("Error!", "Server error. Please try again later.", "error");
    }
  } else {
    swal("Opps!", "Please fill in both fields.", "error");
  }
});
