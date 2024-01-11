from cx_Freeze import setup, Executable

# Dependencies are automatically detected, but it might need fine tuning.
build_exe_options = {"packages": ["os", "subprocess", "tkinter"], "includes": ["tkinter"], "excludes": ["tkinter"]}

setup(
    name = "一括起動ソフトbeta",
    version = "0.1",
    description = "Beta版です",
    options = {"build_exe": build_exe_options},
    executables = [Executable("NEWsoft/test.py", base=None)]
)
