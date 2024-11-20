// Ambil form
const form = document.querySelector('.form');

// Tangani form submission
form.addEventListener('submit', async (e) => {
  e.preventDefault(); // Cegah refresh halaman

  // Ambil nilai input
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    // Kirim data ke backend
    const response = await fetch('http://localhost:4000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    console.log('Response Status:', response.status); // Debug status response
    console.log('Response Headers:', response.headers); // Debug header

    const result = await response.json();

    if (response.ok) {
      swal('Success!', result.message, 'success');
    } else {
      console.error('Backend Error:', result);
      swal('Error!', result.message || 'An unknown error occurred', 'error');
    }
  } catch (err) {
    console.error('Network Error:', err);
    swal('Error!', 'Failed to connect to the server. Please try again later.', 'error');
  }
});
