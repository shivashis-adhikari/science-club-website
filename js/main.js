document.addEventListener('DOMContentLoaded', () => {
    const papersDataPath = 'data/papers.json';
    let allPapers = []; // paper storage

    // paper item function
    function createPaperItem(paper) {
        const item = document.createElement('div');
        item.classList.add('paper-item');

        const link = document.createElement('a');
        link.href = paper.pdf;
        link.target = '_blank'; // new tab open

        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container');

        const img = document.createElement('img');
        
        // Set the image source and handle missing covers
        if (paper.cover && paper.cover.trim() !== "") {
            img.src = paper.cover;
            img.alt = `Cover for ${paper.title}`;
        } else {
            // Set a placeholder for papers without covers
            img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDM1MCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzNTAiIGhlaWdodD0iMjUwIiBmaWxsPSIjZjBmOGZmIi8+CjxwYXRoIGQ9Ik0xMjUgODVIMjI1VjE2NUgxMjVWODVaIiBzdHJva2U9IiMwNTU2YTYiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPgo8Y2lyY2xlIGN4PSIxNTAiIGN5PSIxMTAiIHI9IjE1IiBzdHJva2U9IiMwNTU2YTYiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPgo8cGF0aCBkPSJNMTM1IDEzNUwxNTAgMTIwTDE2NSAxMzVMMTkwIDExMEwyMTAgMTMwVjE1MEgxNDBMMTM1IDEzNVoiIHN0cm9rZT0iIzA1NTZhNiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+Cjx0ZXh0IHg9IjE3NSIgeT0iMTkwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K';
            img.alt = `No cover available for ${paper.title}`;
        }
        
        // Handle image loading errors
        img.onerror = function() {
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDM1MCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzNTAiIGhlaWdodD0iMjUwIiBmaWxsPSIjZjBmOGZmIi8+CjxwYXRoIGQ9Ik0xMjUgODVIMjI1VjE2NUgxMjVWODVaIiBzdHJva2U9IiMwNTU2YTYiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPgo8Y2lyY2xlIGN4PSIxNTAiIGN5PSIxMTAiIHI9IjE1IiBzdHJva2U9IiMwNTU2YTYiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPgo8cGF0aCBkPSJNMTM1IDEzNUwxNTAgMTIwTDE2NSAxMzVMMTkwIDExMEwyMTAgMTMwVjE1MEgxNDBMMTM1IDEzNVoiIHN0cm9rZT0iIzA1NTZhNiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+Cjx0ZXh0IHg9IjE3NSIgeT0iMTkwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiPkltYWdlIEVycm9yPC90ZXh0Pgo8L3N2Zz4K';
            this.alt = 'Image failed to load';
        };

        const textOverlay = document.createElement('div');
        textOverlay.classList.add('text-overlay');

        const title = document.createElement('h3');
        title.textContent = paper.title;

        const author = document.createElement('p');
        author.textContent = paper.author;

        textOverlay.appendChild(title);
        textOverlay.appendChild(author);

        imageContainer.appendChild(img);
        imageContainer.appendChild(textOverlay);

        link.appendChild(imageContainer);
        item.appendChild(link);

        return item;
    }

    function displayPapers(papers, sectionId) {
        const container = document.querySelector(`#${sectionId} .papers-container`);
        if (!container) {
            console.error(`Container not found for section: ${sectionId}`);
            return;
        }
        container.innerHTML = ''; // clear existing papers
        if (papers.length === 0 && sectionId.includes('-papers')) { 
            const sectionElement = document.getElementById(sectionId);
            if (sectionElement && !document.getElementById('searchBar').value.trim()) { 
            } else if (papers.length === 0 && document.getElementById('searchBar').value.trim()) {
            }
            return;
        }
        papers.forEach(paper => {
            container.appendChild(createPaperItem(paper));
        });
    }

    //  load and display all papers
    async function loadAllPapers() {
        try {
            const response = await fetch(papersDataPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            allPapers = [
                ...(data.physics || []).map(p => ({ ...p, category: 'physics' })),
                ...(data.biology || []).map(p => ({ ...p, category: 'biology' })),
                ...(data.chemistry || []).map(p => ({ ...p, category: 'chemistry' })),
                ...(data.others || []).map(p => ({ ...p, category: 'others' })) 
            ];

            displayPapers(data.physics || [], 'physics-papers');
            displayPapers(data.biology || [], 'biology-papers');
            displayPapers(data.chemistry || [], 'chemistry-papers');
            displayPapers(data.others || [], 'others-papers'); 

        } catch (error) {
            console.error("Could not load papers data:", error);
            document.querySelectorAll('.papers-container').forEach(container => {
                container.innerHTML = '<p>Error loading papers. Please try again later.</p>';
            });
        }
    }

    const searchBar = document.getElementById('searchBar');
    const searchButton = document.getElementById('searchButton');

    function handleSearch() {
        const searchTerm = searchBar.value.toLowerCase().trim();

        if (searchTerm === "") {
            document.querySelectorAll('.paper-section').forEach(section => section.style.display = '');
            loadAllPapers(); 
            return;
        }

        const filteredPapers = allPapers.filter(paper =>
            paper.title.toLowerCase().includes(searchTerm) ||
            paper.author.toLowerCase().includes(searchTerm) ||
            (paper.keywords && paper.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm)))
        );

        document.querySelectorAll('.papers-container').forEach(container => container.innerHTML = '');
        document.querySelectorAll('.paper-section').forEach(section => section.style.display = 'none');

        const physicsResults = filteredPapers.filter(p => p.category === 'physics');
        const biologyResults = filteredPapers.filter(p => p.category === 'biology');
        const chemistryResults = filteredPapers.filter(p => p.category === 'chemistry');
        const othersResults = filteredPapers.filter(p => p.category === 'others'); 

        if (physicsResults.length > 0) {
            document.getElementById('physics-papers').style.display = '';
            displayPapers(physicsResults, 'physics-papers');
        }
        if (biologyResults.length > 0) {
            document.getElementById('biology-papers').style.display = '';
            displayPapers(biologyResults, 'biology-papers');
        }
        if (chemistryResults.length > 0) {
            document.getElementById('chemistry-papers').style.display = '';
            displayPapers(chemistryResults, 'chemistry-papers');
        }
        if (othersResults.length > 0) {
            document.getElementById('others-papers').style.display = '';
            displayPapers(othersResults, 'others-papers');
        }

        if (filteredPapers.length === 0) {
            const firstSectionContainer = document.querySelector('#physics-papers .papers-container');
            if (firstSectionContainer) {
                document.getElementById('physics-papers').style.display = ''; // show the section to display the message
                firstSectionContainer.innerHTML = '<p>No papers found matching your search.</p>';
            }
             // function to hide all sections if no results
            document.getElementById('biology-papers').style.display = 'none';
            document.getElementById('chemistry-papers').style.display = 'none';
            document.getElementById('others-papers').style.display = 'none';
        }
    }

    if (searchButton && searchBar) {
        searchButton.addEventListener('click', handleSearch);
        searchBar.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                handleSearch();
            }
            if (event.key === 'Backspace' && searchBar.value.trim() === "") {
                document.querySelectorAll('.paper-section').forEach(section => section.style.display = '');
                loadAllPapers(); 
            }
        });
    } else {
        console.warn("Search bar or button not found on this page.");
    }

    if (document.querySelector('.paper-section')) {
        loadAllPapers();
    }
});