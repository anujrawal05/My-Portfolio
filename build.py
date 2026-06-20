import os
from jinja2 import Environment, FileSystemLoader

def main():
    print("Starting static build...")

    # Define paths
    base_dir = os.path.dirname(os.path.abspath(__file__))
    templates_dir = os.path.join(base_dir, 'templates')
    
    # Initialize Jinja2 environment
    env = Environment(loader=FileSystemLoader(templates_dir))

    # Custom url_for implementation for static generation
    def url_for(endpoint, **values):
        if endpoint == 'static':
            filename = values.get('filename')
            return f"static/{filename}"
        elif endpoint == 'home':
            return 'index.html'
        elif endpoint == 'books':
            return 'books.html'
        elif endpoint == 'book_eternal_way':
            return 'book_eternal_way.html'
        elif endpoint == 'book_birth_death':
            return 'book_birth_death.html'
        elif endpoint == 'book_hindi_edition':
            return 'book_hindi_edition.html'
        elif endpoint == 'book_vankari':
            return 'book_vankari.html'
        elif endpoint == 'download_resume':
            return 'static/files/resume.pdf'
        else:
            return f"#{endpoint}"

    # Inject context globals
    env.globals['url_for'] = url_for
    env.globals['get_flashed_messages'] = lambda **kwargs: []

    # Map of template names to output filenames
    pages = {
        'index.html': 'index.html',
        'books.html': 'books.html',
        'book_eternal_way.html': 'book_eternal_way.html',
        'book_birth_death.html': 'book_birth_death.html',
        'book_hindi_edition.html': 'book_hindi_edition.html',
        'book_vankari.html': 'book_vankari.html'
    }

    for template_name, output_name in pages.items():
        output_path = os.path.join(base_dir, output_name)
        print(f"Rendering {template_name} -> {output_path}...")
        template = env.get_template(template_name)
        html_content = template.render()
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(html_content)

    print("Static build successful! All pages rendered.")

if __name__ == '__main__':
    main()
