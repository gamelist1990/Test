import os
import subprocess
import tkinter as tk
from tkinter import filedialog, messagebox

class AppLauncher:
    def __init__(self, master):
        self.master = master
        self.apps = []
        self.config_dir = os.path.join(os.path.expanduser('~'), 'Documents', 'TESTAC')
        self.config_path = os.path.join(self.config_dir, 'config.txt')
        if not os.path.exists(self.config_dir):
            os.makedirs(self.config_dir)
        self.load_apps()
        self.launch_button = tk.Button(master, text="Launch Apps", command=self.launch_apps)
        self.launch_button.pack()
        self.add_button = tk.Button(master, text="Add App", command=self.add_app)
        self.add_button.pack()
        self.app_listbox = tk.Listbox(master)
        self.app_listbox.pack()
        self.app_listbox.bind('<Double-1>', self.remove_app)
        self.display_apps()

    def add_app(self):
        filename = filedialog.askopenfilename(initialdir="/", title="Select App",
                                              filetypes=(("executables", "*.exe"), ("all files", "*.*")))
        self.apps.append(filename)
        self.save_apps()
        self.display_apps()

    def launch_apps(self):
        for app in self.apps:
            subprocess.Popen(app)

    def load_apps(self):
        if not os.path.isfile(self.config_path):
            return
        with open(self.config_path, 'r') as f:
            self.apps = f.read().splitlines()

    def save_apps(self):
        with open(self.config_path, 'w') as f:
            for app in self.apps:
                f.write(app + '\n')

    def display_apps(self):
        self.app_listbox.delete(0, tk.END)
        for app in self.apps:
            self.app_listbox.insert(tk.END, os.path.basename(app))

    def remove_app(self, event):
        selection = self.app_listbox.curselection()
        if not selection:
            return
        app_index = selection[0]
        app_name = self.app_listbox.get(app_index)
        result = messagebox.askquestion("Remove App", f"Are you sure you want to remove {app_name}?", icon='warning')
        if result == 'yes':
            self.apps.remove(self.apps[app_index])
            self.save_apps()
            self.display_apps()

root = tk.Tk()
root.geometry("500x500")  # ウィンドウのサイズを500x500ピクセルに設定します。
app = AppLauncher(root)
root.mainloop()
