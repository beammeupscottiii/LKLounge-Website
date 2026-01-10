// Nav Menu 
const menuToggle = document.getElementById('menu-toggle');
const menuClose = document.getElementById('menu-close');
const navOverlay = document.getElementById('nav-overlay');
const navLinks = document.querySelectorAll('.nav-link');

// Function to open menu
menuToggle.addEventListener('click', () => {
    navOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden'; // Prevents scrolling behind the menu
});

// Function to close menu
const closeMenu = () => {
    navOverlay.classList.remove('is-open');
    document.body.style.overflow = 'auto'; // Restores scrolling
};

menuClose.addEventListener('click', closeMenu);

// Close menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
});


// Gallery
const buttons = document.querySelectorAll('button.toggle-btn');
const sliders = document.querySelectorAll('div.slider');
const progressIndicator = document.querySelector('div.progress-indicator');

// Handle Toggle
buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    // UI Update
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Section Update
    const target = btn.getAttribute('data-target');
    sliders.forEach(s => {
      s.classList.toggle('hidden', s.id !== target);
      if (s.id === target) updateProgress(s); // Reset progress for new slider
    });
  });
});

// Update Progress Bar based on scroll
function updateProgress(el) {
  const percentage = (el.scrollLeft / (el.scrollWidth - el.clientWidth)) * 100;
  progressIndicator.style.width = `${percentage}%`;
}

sliders.forEach(slider => {
  slider.addEventListener('scroll', () => updateProgress(slider));
});





// Calendar
// 1. Get the actual current date from the user's system
const now = new Date(); 
const currentYear = now.getFullYear();
const currentMonth = now.getMonth();
const currentDate = now.getDate();

// 2. Track the month the user is currently looking at
// Start by viewing the actual current month
let viewDate = new Date(currentYear, currentMonth, 1); 

const monthDisplay = document.getElementById('monthDisplay');
const calendarGrid = document.getElementById('calendarGrid');
const prevBtn = document.getElementById('prevMonth');
const nextBtn = document.getElementById('nextMonth');

const monthNames = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"];

function renderCalendar() {
  calendarGrid.innerHTML = '';
  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();

  monthDisplay.innerText = `${monthNames[viewMonth]} ${viewYear}`;

  // 3. Back Button Logic: Hide if we are looking at the current real month or earlier
  if (viewYear > currentYear ||  viewMonth > currentMonth) {
    prevBtn.classList.remove('hidden');
  } else {
    prevBtn.classList.add('hidden');
  }

  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
  const lastDay = new Date(viewYear, viewMonth + 1, 0).getDate();

  // Spacers for the first week
  for (let x = 0; x < firstDayIndex; x++) {
    const spacer = document.createElement('div');
    spacer.className = 'date-cell-empty';
    calendarGrid.appendChild(spacer);
  }

  // Populate Days
  for (let i = 1; i <= lastDay; i++) {
    const cell = document.createElement('div');
    cell.innerText = i;
    
    // 4. Comparison logic to "blank out" past days in the current month
    const isPast = (viewYear === currentYear && viewMonth === currentMonth && i < currentDate);

    if (isPast) {
      cell.className = 'date-cell past';
      cell.tabIndex = -1;
    } else {
      cell.className = 'date-cell selectable';
      cell.onclick = () => {
          // Remove active class from others and add to this one
          document.querySelectorAll('.selectable').forEach(el => el.classList.remove('active'));
          cell.classList.add('active');
          console.log(`Selected: ${monthNames[viewMonth]} ${i}`);
      };
    }

    cell.onclick = () => {
      // UI Feedback for selection
      if (cell.classList.contains('past')) {
        return;
      } else {
        document.querySelectorAll('.selectable').forEach(el => el.classList.remove('active'));
        cell.classList.add('active');
      }
      

      // Populate Form Data
      const formattedDate = `${monthNames[viewMonth]} ${i}, ${viewYear}`;
      document.getElementById('reservation_date').value = formattedDate;
      document.getElementById('selected-date-display').innerText = `Requesting for: ${formattedDate}`;

      // Show the form with smooth transition
      const formContainer = document.getElementById('reservation-container');
      formContainer.classList.remove('hidden');
      formContainer.classList.add('visible');
      // Auto-scroll to form
      formContainer.scrollIntoView({ behavior: 'smooth' });
    };

    calendarGrid.appendChild(cell);
  }

  
}

// Nav Listeners
nextBtn.onclick = () => { viewDate.setMonth(viewDate.getMonth() + 1); renderCalendar(); };
prevBtn.onclick = () => { viewDate.setMonth(viewDate.getMonth() - 1); renderCalendar(); };

renderCalendar();