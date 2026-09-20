import { Course, ResourceItem } from '../types';

export interface DownloadedCourseMeta {
  courseId: string;
  courseTitle: string;
  courseThumbnail: string;
  downloadedAt: string;
  totalLessons: number;
  totalResources: number;
  sizeBytes: number;
  sizeFormatted: string;
  version: string;
}

export interface OfflineResourceContent {
  id: string;
  name: string;
  type: string;
  courseId: string;
  courseTitle: string;
  content: string; // Printable text/markdown guide representation
  size: string;
  cachedAt: string;
}

const STORAGE_KEY_META = 'complisey_offline_courses_meta_v1';
const STORAGE_KEY_DATA = 'complisey_offline_courses_data_v1';
const STORAGE_KEY_RESOURCES = 'complisey_offline_resources_v1';
const CACHE_NAME_APP = 'complisey-course-materials-cache';

class OfflineStorageService {
  private listeners: Set<() => void> = new Set();

  public subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch (e) {
        console.error('Offline storage listener error:', e);
      }
    });
  }

  /**
   * Retrieves list of all courses currently downloaded for offline study
   */
  public getDownloadedCourses(): DownloadedCourseMeta[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_META);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  /**
   * Automatically pre-caches the primary statutory course on first launch
   */
  public initAutoPrecache(courses: Course[]) {
    try {
      const existing = this.getDownloadedCourses();
      if (existing.length === 0 && courses.length > 0) {
        // Automatically pre-cache first course
        this.downloadCourse(courses[0]);
      }
    } catch (e) {
      console.warn('Auto precache initial run:', e);
    }
  }

  /**
   * Checks whether a given course is saved for offline use
   */
  public isCourseDownloaded(courseId: string): boolean {
    const list = this.getDownloadedCourses();
    return list.some((item) => item.courseId === courseId);
  }

  /**
   * Returns full cached course data for offline player
   */
  public getOfflineCourseData(courseId: string): Course | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_DATA);
      if (!raw) return null;
      const dict = JSON.parse(raw);
      return dict[courseId] || null;
    } catch {
      return null;
    }
  }

  /**
   * Generates realistic statutory content for course resources
   */
  public generateResourceDocument(resource: ResourceItem, course: Course): string {
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    return `================================================================================
COMPLISEY ACADEMY | AML/CFT COMPLIANCE RESOURCE PACK
================================================================================
Document: ${resource.name}
Course: ${course.title}
Issued by: CompliSey Compliance Faculty · Complisanc Consulting Services (SEY)
Jurisdiction: Republic of Seychelles (AML/CFT Compliance Framework)
Archived for Offline Study: ${dateStr}
================================================================================

1. EXECUTIVE SUMMARY
This guidance resource has been pre-cached by CompliSey Academy's
offline learning engine to facilitate continuous professional training and
examination readiness for compliance officers, MLROs, and reporting entity staff.

2. CORE OBLIGATIONS & REGULATORY CHECKLIST
- Regulatory Framework: Anti-Money Laundering and Countering the Financing of Terrorism Framework.
- Training Standard: Comprehensive AML/CFT staff curriculum and periodic competency updates.
- Obligation: Maintain institutional compliance policies, client risk categorization, and ongoing staff training logs.
- Record Retention: Keep training attendance logs and audit certificates on file for at least 7 years for supervisory compliance verification.

3. ACTIONABLE GUIDANCE
- Conduct Customer Due Diligence (CDD) prior to establishing any business relationship.
- Apply Enhanced Due Diligence (EDD) for Politically Exposed Persons (PEPs) and high-risk jurisdictions.
- Verify Beneficial Ownership (natural persons holding >= 10% direct or indirect control).
- Submit Suspicious Transaction Reports (STRs) directly to the Financial Intelligence Unit without tipping off the subject.

4. OFFICIAL AUDIT NOTICE
Retention of this document alongside your CompliSey Verified Certificate of Completion
satisfies the documentary evidence requirement for your firm's annual AML/CFT training audit.

Complisey Academy · Victoria, Mahé, Republic of Seychelles
Administration: Malcolm Simon (malcolm@complisanc.com) · Training: Eric D'Souza (eric@complisanc.com)
================================================================================`;
  }

  /**
   * Downloads and caches complete course materials, lessons, notes, and resources
   */
  public async downloadCourse(course: Course): Promise<DownloadedCourseMeta> {
    // 1. Save full course structure to offline data store
    let coursesDict: Record<string, Course> = {};
    try {
      const raw = localStorage.getItem(STORAGE_KEY_DATA);
      if (raw) coursesDict = JSON.parse(raw);
    } catch {
      coursesDict = {};
    }
    coursesDict[course.id] = course;
    localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(coursesDict));

    // 2. Cache all resources for offline downloading/reading
    let resourcesDict: Record<string, OfflineResourceContent> = {};
    try {
      const rawRes = localStorage.getItem(STORAGE_KEY_RESOURCES);
      if (rawRes) resourcesDict = JSON.parse(rawRes);
    } catch {
      resourcesDict = {};
    }

    let totalResourceCount = 0;
    course.modules.forEach((mod) => {
      mod.lessons.forEach((les) => {
        if (les.resources) {
          les.resources.forEach((res) => {
            totalResourceCount++;
            const textContent = this.generateResourceDocument(res, course);
            resourcesDict[res.id] = {
              id: res.id,
              name: res.name,
              type: res.type,
              courseId: course.id,
              courseTitle: course.title,
              content: textContent,
              size: res.size,
              cachedAt: new Date().toISOString(),
            };
          });
        }
      });
    });
    localStorage.setItem(STORAGE_KEY_RESOURCES, JSON.stringify(resourcesDict));

    // 3. Cache assets in CacheStorage if supported
    if ('caches' in window) {
      try {
        const cache = await caches.open(CACHE_NAME_APP);
        // Cache course thumbnail
        if (course.thumbnail) {
          try {
            await cache.add(new Request(course.thumbnail, { mode: 'no-cors' }));
          } catch (err) {
            // Ignore CORS or third-party image cache failures
          }
        }
        // Cache instructor avatar
        if (course.instructor?.avatar) {
          try {
            await cache.add(new Request(course.instructor.avatar, { mode: 'no-cors' }));
          } catch (err) {
            // Ignore
          }
        }
      } catch (e) {
        console.warn('CacheStorage cache open note:', e);
      }
    }

    // 4. Calculate approximate offline payload size
    const lessonsCount = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
    const approxBytes = JSON.stringify(course).length * 2 + totalResourceCount * 12000 + 450000;
    const sizeMb = (approxBytes / (1024 * 1024)).toFixed(1);

    const meta: DownloadedCourseMeta = {
      courseId: course.id,
      courseTitle: course.title,
      courseThumbnail: course.thumbnail,
      downloadedAt: new Date().toISOString(),
      totalLessons: lessonsCount,
      totalResources: totalResourceCount,
      sizeBytes: approxBytes,
      sizeFormatted: `${sizeMb} MB`,
      version: '2026.1',
    };

    // 5. Update meta list
    const currentMetaList = this.getDownloadedCourses().filter((c) => c.courseId !== course.id);
    currentMetaList.unshift(meta);
    localStorage.setItem(STORAGE_KEY_META, JSON.stringify(currentMetaList));

    this.notify();
    return meta;
  }

  /**
   * Removes a downloaded course from offline cache
   */
  public removeDownloadedCourse(courseId: string) {
    // 1. Remove from meta
    const list = this.getDownloadedCourses().filter((c) => c.courseId !== courseId);
    localStorage.setItem(STORAGE_KEY_META, JSON.stringify(list));

    // 2. Remove from data
    try {
      const raw = localStorage.getItem(STORAGE_KEY_DATA);
      if (raw) {
        const dict = JSON.parse(raw);
        delete dict[courseId];
        localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(dict));
      }
    } catch (e) {
      console.error(e);
    }

    // 3. Remove resources
    try {
      const rawRes = localStorage.getItem(STORAGE_KEY_RESOURCES);
      if (rawRes) {
        const dict = JSON.parse(rawRes);
        Object.keys(dict).forEach((key) => {
          if (dict[key].courseId === courseId) {
            delete dict[key];
          }
        });
        localStorage.setItem(STORAGE_KEY_RESOURCES, JSON.stringify(dict));
      }
    } catch (e) {
      console.error(e);
    }

    this.notify();
  }

  /**
   * Retrieves an offline resource and triggers a native browser download
   */
  public downloadOfflineResource(resourceId: string, fallbackCourse?: Course): boolean {
    try {
      let content = '';
      let filename = 'CompliSey-Resource.txt';

      const rawRes = localStorage.getItem(STORAGE_KEY_RESOURCES);
      if (rawRes) {
        const dict = JSON.parse(rawRes);
        if (dict[resourceId]) {
          content = dict[resourceId].content;
          filename = dict[resourceId].name;
        }
      }

      if (!content && fallbackCourse) {
        // Find resource in fallback course
        for (const m of fallbackCourse.modules) {
          for (const l of m.lessons) {
            const found = l.resources?.find((r) => r.id === resourceId);
            if (found) {
              content = this.generateResourceDocument(found, fallbackCourse);
              filename = found.name;
              break;
            }
          }
          if (content) break;
        }
      }

      if (!content) {
        content = `CompliSey Academy Compliance Guide\nResource ID: ${resourceId}\nGenerated offline.`;
      }

      // Create a text/plain or markdown blob and trigger download
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename.endsWith('.pdf') ? filename.replace('.pdf', '-StudyGuide.txt') : filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return true;
    } catch (err) {
      console.error('Failed to download offline resource:', err);
      return false;
    }
  }

  /**
   * Retrieves total offline storage used
   */
  public getTotalOfflineStorage(): { totalBytes: number; totalFormatted: string; count: number } {
    const list = this.getDownloadedCourses();
    const totalBytes = list.reduce((acc, c) => acc + c.sizeBytes, 0);
    const mb = (totalBytes / (1024 * 1024)).toFixed(1);
    return {
      totalBytes,
      totalFormatted: `${mb} MB`,
      count: list.length,
    };
  }

  /**
   * Clears all offline course storage
   */
  public async clearAllOfflineStorage() {
    localStorage.removeItem(STORAGE_KEY_META);
    localStorage.removeItem(STORAGE_KEY_DATA);
    localStorage.removeItem(STORAGE_KEY_RESOURCES);

    if ('caches' in window) {
      try {
        await caches.delete(CACHE_NAME_APP);
      } catch (e) {
        console.warn('Cache delete note:', e);
      }
    }

    this.notify();
  }
}

export const offlineStorageService = new OfflineStorageService();
