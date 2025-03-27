// script.js  
document.addEventListener('DOMContentLoaded', function() {  
    // Sample course data  
    const courses = [  
        {  
            id: 1,  
            title: "Introduction to Company Policies",  
            duration: "2 hours",  
            progress: 75,  
            category: "Onboarding",  
            status: "inProgress",  
            dueDate: "2024-02-20"  
        },  
        {  
            id: 2,  
            title: "Cybersecurity Fundamentals",  
            duration: "4 hours",  
            progress: 0,  
            category: "IT Security",  
            status: "assigned",  
            dueDate: "2024-03-01"  
        },  
        {  
            id: 3,  
            title: "Leadership Skills 101",  
            duration: "6 hours",  
            progress: 100,  
            category: "Professional Development",  
            status: "completed",  
            completedDate: "2024-01-15"  
        }, 
        ,  
        {  
            id: 4,  
            title: "Basic Skills",  
            duration: "6 hours",  
            progress: 100,  
            category: "Basic Skills Development",  
            status: "completed",  
            completedDate: "2024-01-15"  
        },  
        // Add more courses as needed  
    ];  

    // DOM Elements  
    const courseGrid = document.getElementById('courseGrid');  
    const searchInput = document.getElementById('searchInput');  
    const tabButtons = document.querySelectorAll('.tab-btn');  

    // Current filter state  
    let currentFilter = 'all';  
    let searchQuery = '';  

    // Filter courses based on status and search query  
    function filterCourses() {  
        return courses.filter(course => {  
            const matchesStatus = currentFilter === 'all' || course.status === currentFilter;  
            const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());  
            return matchesStatus && matchesSearch;  
        });  
    }  

    // Create HTML for a single course card  
    function createCourseCard(course) {  
        const statusClass = {  
            inProgress: 'text-blue-600',  
            completed: 'text-green-600',  
            assigned: 'text-orange-600'  
        };  

        const statusText = {  
            inProgress: 'In Progress',  
            completed: 'Completed',  
            assigned: 'Assigned'  
        };  

        return `  
            <div class="course-card">  
                <div class="course-content">  
                    <span class="course-category">${course.category}</span>  
                    <h3 class="course-title">${course.title}</h3>  
                    <div class="course-duration">  
                        <i class="fas fa-clock"></i>  
                        <span>${course.duration}</span>  
                    </div>  
                    ${course.status === 'inProgress' ? `  
                        <div class="progress-section">  
                            <div class="progress-bar">  
                                <div class="progress-fill" style="width: ${course.progress}%"></div>  
                            </div>  
                            <div class="course-status ${statusClass[course.status]}">  
                                <i class="fas fa-spinner"></i>  
                                <span>${course.progress}% Complete</span>  
                            </div>  
                        </div>  
                    ` : ''}  
                    ${course.status === 'completed' ? `  
                        <div class="course-status ${statusClass[course.status]}">  
                            <i class="fas fa-check-circle"></i>  
                            <span>${statusText[course.status]} on ${course.completedDate}</span>  
                        </div>  
                    ` : ''}  
                    ${course.status === 'assigned' ? `  
                        <div class="course-status ${statusClass[course.status]}">  
                            <i class="fas fa-calendar"></i>  
                            <span>Due by ${course.dueDate}</span>  
                        </div>  
                    ` : ''}  
                </div>  
                <div class="course-action">  
                    <button class="action-btn" aria-label="${course.status === 'completed' ? 'Review Course' : 'Continue Learning'}">  
                        ${course.status === 'completed' ? 'Review Course' : 'Continue Learning'}  
                    </button>  
                </div>  
            </div>  
        `;  
    }  

    // Render courses  
    function renderCourses() {  
        const filteredCourses = filterCourses();  
        courseGrid.innerHTML = filteredCourses.map(createCourseCard).join('');  
    }  

    // Event Listeners  
    searchInput.addEventListener('input', (e) => {  
        searchQuery = e.target.value;  
        renderCourses();  
    });  

    tabButtons.forEach(button => {  
        button.addEventListener('click', () => {  
            // Update active tab  
            tabButtons.forEach(btn => btn.classList.remove('active'));  
            button.classList.add('active');  
            
            // Update filter and render  
            currentFilter = button.dataset.status;  
            renderCourses();  
        });  
    });  

    // Initial render  
    renderCourses();  
});