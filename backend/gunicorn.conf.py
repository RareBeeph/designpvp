import os

workers = max(1, len(os.sched_getaffinity(0))) * 2 + 1
