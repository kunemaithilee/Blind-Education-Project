import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getCourses } from "../../services/courseService";

const categories = ["All", "Science", "Math", "English", "Technology", "Life Skills"];

const fallbackCourses = [
  {
    id: 1,
    slug: "physics-through-sound",
    title: "Physics Through Sound",
    category: "Science",
    level: "Beginner",
    duration: "4h 20m",
    lessons: 14,
    completed: 9,
    progress: 64,
    accent: "purple",
    description: "Understand motion, force, energy and waves through audio-first explanations.",
    nextLesson: "Sound waves and vibration",
  },
  {
    id: 2,
    slug: "organic-chemistry-basics",
    title: "Organic Chemistry Basics",
    category: "Science",
    level: "Intermediate",
    duration: "6h 10m",
    lessons: 18,
    completed: 13,
    progress: 75,
    accent: "blue",
    description: "Learn compounds, reactions and naming rules with guided voice summaries.",
    nextLesson: "Alkanes and cycloalkanes",
  },
  {
    id: 3,
    slug: "algebra-with-audio-steps",
    title: "Algebra With Audio Steps",
    category: "Math",
    level: "Beginner",
    duration: "5h 45m",
    lessons: 16,
    completed: 5,
    progress: 31,
    accent: "green",
    description: "Practice equations, variables and expressions with spoken step-by-step logic.",
    nextLesson: "Solving linear equations",
  },
  {
    id: 4,
    slug: "english-grammar-essentials",
    title: "English Grammar Essentials",
    category: "English",
    level: "Beginner",
    duration: "3h 30m",
    lessons: 12,
    completed: 12,
    progress: 100,
    accent: "purple",
    description: "Master sentence structure, tenses and punctuation through clear examples.",
    nextLesson: "Final revision",
  },
  {
    id: 5,
    slug: "computer-fundamentals",
    title: "Computer Fundamentals",
    category: "Technology",
    level: "Beginner",
    duration: "4h 50m",
    lessons: 15,
    completed: 3,
    progress: 20,
    accent: "blue",
    description: "Build confidence with computers, files, browsers and keyboard navigation.",
    nextLesson: "Understanding operating systems",
  },
  {
    id: 6,
    slug: "independent-living-skills",
    title: "Independent Living Skills",
    category: "Life Skills",
    level: "Practical",
    duration: "2h 40m",
    lessons: 10,
    completed: 4,
    progress: 40,
    accent: "green",
    description: "Audio lessons for organization, routines, mobility preparation and confidence.",
    nextLesson: "Planning your study day",
  },
];

function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState(fallbackCourses);
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");
  const selectedCourseSlug = searchParams.get("course");
  const selectedCategory = searchParams.get("category");

  useEffect(() => {
    getCourses().then((items) => {
      if (items.length) {
        setCourses(items);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedCategory && categories.includes(selectedCategory)) {
      setActiveCategory(selectedCategory);
      setQuery("");
      return;
    }

    const selectedCourse = courses.find((course) => course.slug === selectedCourseSlug);

    if (selectedCourse) {
      setActiveCategory("All");
      setQuery(selectedCourse.title);
    }
  }, [courses, selectedCategory, selectedCourseSlug]);

  const filteredCourses = useMemo(() => {
    const searchText = query.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesCategory = activeCategory === "All" || course.category === activeCategory;
      const matchesSearch =
        !searchText ||
        course.title.toLowerCase().includes(searchText) ||
        course.description.toLowerCase().includes(searchText) ||
        course.category.toLowerCase().includes(searchText);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, courses, query]);

  const featuredCourse = courses.find((course) => course.slug === selectedCourseSlug) || courses[1];

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setQuery("");

    if (category === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  return (
    <section className="page courses-page">
      <header className="courses-hero">
        <div>
          <span className="page-kicker">Course Library</span>
          <h1>Choose what you want to learn</h1>
          <p>Browse accessible audio-first courses made for voice navigation, screen readers and focused listening.</p>
        </div>
        <div className="course-summary-card" aria-label="Course summary">
          <strong>{courses.length}</strong>
          <span>Available Courses</span>
          <p>Science, Math, English, Technology and Life Skills</p>
        </div>
      </header>

      <section className="course-toolbar" aria-label="Course search and filters">
        <label>
          <span>Search courses</span>
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setSearchParams({});
            }}
            placeholder="Search by subject or title"
          />
        </label>

        <div className="course-filters" aria-label="Course categories">
          {categories.map((category) => (
            <button
              className={activeCategory === category ? "active" : ""}
              key={category}
              onClick={() => handleCategoryChange(category)}
              type="button"
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="featured-course" aria-label="Featured course">
        <div>
          <span className="page-kicker">Continue Learning</span>
          <h2>{featuredCourse.title}</h2>
          <p>{featuredCourse.description}</p>
          <div className="course-meta">
            <span>{featuredCourse.level}</span>
            <span>{featuredCourse.duration}</span>
            <span>{featuredCourse.completed}/{featuredCourse.lessons} lessons</span>
          </div>
        </div>
        <div className="featured-progress">
          <strong>{featuredCourse.progress}%</strong>
          <span>Completed</span>
          <div className="course-progress"><i style={{ width: `${featuredCourse.progress}%` }} /></div>
          <Link to="/lesson">Continue Lesson</Link>
        </div>
      </section>

      <div className="courses-layout">
        <section className="course-grid" aria-label="Course list">
          {filteredCourses.length ? filteredCourses.map((course) => (
            <article
              className={`course-card accent-${course.accent} ${selectedCourseSlug === course.slug ? "selected" : ""}`}
              id={course.slug}
              key={course.id}
            >
              <div className="course-card-top">
                <span>{course.category}</span>
                <strong>{course.progress}%</strong>
              </div>
              <h2>{course.title}</h2>
              <p>{course.description}</p>
              <div className="course-meta">
                <span>{course.level}</span>
                <span>{course.duration}</span>
                <span>{course.lessons} lessons</span>
              </div>
              <div className="course-progress" aria-label={`${course.progress} percent complete`}>
                <i style={{ width: `${course.progress}%` }} />
              </div>
              <div className="course-card-footer">
                <span>Next: {course.nextLesson}</span>
                <Link to={`/courses?course=${course.slug}`}>Open</Link>
              </div>
            </article>
          )) : (
            <div className="course-empty">
              <h2>No courses found</h2>
              <p>Try another search term or choose a different category.</p>
              <button type="button" onClick={() => {
                setQuery("");
                setActiveCategory("All");
                setSearchParams({});
              }}>
                Reset Filters
              </button>
            </div>
          )}
        </section>

        <aside className="lesson-preview" aria-label="Upcoming lessons">
          <h2>Upcoming Lessons</h2>
          <ol>
            <li>
              <strong>Sound waves and vibration</strong>
              <span>Physics Through Sound</span>
            </li>
            <li>
              <strong>Alkanes and cycloalkanes</strong>
              <span>Organic Chemistry Basics</span>
            </li>
            <li>
              <strong>Solving linear equations</strong>
              <span>Algebra With Audio Steps</span>
            </li>
          </ol>
          <Link to="/lesson">Go to Lesson Player</Link>
        </aside>
      </div>
    </section>
  );
}

export default Courses;
