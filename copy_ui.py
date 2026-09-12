import os

extract_dir = r"C:\Users\himan\blurr_src\spotfree\extracted_ui"
backend_dir = r"C:\Users\himan\blurr_src\spotfree\backend"

# Let's copy index.html and assets or build output directly into backend/frontend or backend/static
import shutil
target_frontend = os.path.join(backend_dir, "frontend")
if os.path.exists(target_frontend):
    shutil.rmtree(target_frontend)
shutil.copytree(extract_dir, target_frontend)
print("Copied extracted UI into backend/frontend!")
