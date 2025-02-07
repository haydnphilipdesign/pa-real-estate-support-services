import { TransactionFormData } from '../components/TransactionForm/types';
import { BrowserInfo, getDeviceInfo } from '../utils/browser';

export interface FieldInteraction {
  focusCount: number;
  changeCount: number;
  timeSpent: number;
  lastValue: string;
  validationAttempts: number;
  validationErrors: string[];
  lastModified: Date;
}

export interface NavigationEvent {
  from: string;
  to: string;
  timestamp: Date;
  timeSpent: number;
}

export interface ValidationMetrics {
  fieldName: string;
  attempts: number;
  errors: string[];
  timestamp: Date;
}

export interface PerformanceMetrics {
  formLoadTime: number;
  firstInteractionTime: number;
  totalTimeSpent: number;
  submitAttempts: number;
  successfulSubmit: boolean;
  autosaveCount: number;
  formResets: number;
  sectionLoadTimes: Record<string, number>;
  sectionTimeSpent: Record<string, number>;
  sectionCompletionStatus: Record<string, boolean>;
  completionRate: number;
}

export interface FormAnalytics {
  sessionId: string;
  timestamp: Date;
  agentId: string;
  formId: string;
  fieldInteractions: Record<string, FieldInteraction>;
  navigationHistory: NavigationEvent[];
  validationAttempts: ValidationMetrics[];
  performanceMetrics: PerformanceMetrics;
  formCompletionRate: number;
  errorCounts: Record<string, number>;
  browserInfo: BrowserInfo;
  customEvents: Array<{
    type: string;
    data: any;
    timestamp: Date;
  }>;
  currentSection?: {
    name: string;
    startTime: number;
  };
}

class AnalyticsService {
  private analytics: FormAnalytics[] = [];
  private currentSession: FormAnalytics | null = null;
  private readonly MAX_STORED_ENTRIES = 100;

  constructor() {
    this.loadStoredAnalytics();
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadStoredAnalytics(): void {
    try {
      const stored = localStorage.getItem('formAnalytics');
      if (stored) {
        this.analytics = JSON.parse(stored).slice(-this.MAX_STORED_ENTRIES);
      }
    } catch (error) {
      console.error('Error loading stored analytics:', error);
      this.analytics = [];
    }
  }

  public initializeSession(agentId: string, formId: string): void {
    this.currentSession = {
      sessionId: this.generateSessionId(),
      timestamp: new Date(),
      agentId,
      formId,
      fieldInteractions: {},
      navigationHistory: [],
      validationAttempts: [],
      performanceMetrics: {
        formLoadTime: performance.now(),
        firstInteractionTime: 0,
        totalTimeSpent: 0,
        submitAttempts: 0,
        successfulSubmit: false,
        autosaveCount: 0,
        formResets: 0,
        sectionLoadTimes: {},
        sectionTimeSpent: {},
        sectionCompletionStatus: {},
        completionRate: 0
      },
      formCompletionRate: 0,
      errorCounts: {},
      browserInfo: getDeviceInfo(),
      customEvents: []
    };
  }

  public startSection(sectionName: string): void {
    if (!this.currentSession) return;
    
    // If there's a current section, end it first
    if (this.currentSession.currentSection) {
      this.endSection(this.currentSession.currentSection.name);
    }

    this.currentSession.currentSection = {
      name: sectionName,
      startTime: performance.now()
    };

    // Record section load time
    this.currentSession.performanceMetrics.sectionLoadTimes[sectionName] = performance.now();
  }

  public endSection(sectionName: string): void {
    if (!this.currentSession || !this.currentSession.currentSection) return;
    
    if (this.currentSession.currentSection.name === sectionName) {
      const timeSpent = performance.now() - this.currentSession.currentSection.startTime;
      
      // Update section time spent
      this.currentSession.performanceMetrics.sectionTimeSpent[sectionName] = 
        (this.currentSession.performanceMetrics.sectionTimeSpent[sectionName] || 0) + timeSpent;
      
      this.currentSession.currentSection = undefined;
    }
  }

  public completeSection(sectionName: string): void {
    if (!this.currentSession) return;
    
    this.currentSession.performanceMetrics.sectionCompletionStatus[sectionName] = true;
    this.updateCompletionRate();
  }

  public updateCompletionRate(completedSections: number, totalSections: number): void {
    if (!this.currentSession) return;
    
    this.currentSession.performanceMetrics.completionRate = (completedSections / totalSections) * 100;
  }

  public recordError(sectionName: string, error: string): void {
    if (!this.currentSession) return;
    
    if (!this.currentSession.errorCounts[sectionName]) {
      this.currentSession.errorCounts[sectionName] = 0;
    }
    this.currentSession.errorCounts[sectionName]++;

    this.currentSession.customEvents.push({
      type: 'error',
      data: { section: sectionName, error },
      timestamp: new Date()
    });
  }

  public trackFieldInteraction(fieldName: string, type: 'focus' | 'change' | 'blur', value: string): void {
    if (!this.currentSession) return;

    const interaction = this.currentSession.fieldInteractions[fieldName] || {
      focusCount: 0,
      changeCount: 0,
      timeSpent: 0,
      lastValue: '',
      validationAttempts: 0,
      validationErrors: [],
      lastModified: new Date()
    };

    switch (type) {
      case 'focus':
        interaction.focusCount++;
        if (!this.currentSession.performanceMetrics.firstInteractionTime) {
          this.currentSession.performanceMetrics.firstInteractionTime = performance.now();
        }
        break;
      case 'change':
        interaction.changeCount++;
        interaction.lastValue = value;
        break;
      case 'blur':
        interaction.timeSpent += performance.now() - interaction.lastModified.getTime();
        break;
    }

    interaction.lastModified = new Date();
    this.currentSession.fieldInteractions[fieldName] = interaction;
  }

  public trackNavigation(from: string, to: string): void {
    if (!this.currentSession) return;

    const event: NavigationEvent = {
      from,
      to,
      timestamp: new Date(),
      timeSpent: 0
    };

    const lastEvent = this.currentSession.navigationHistory[this.currentSession.navigationHistory.length - 1];
    if (lastEvent) {
      event.timeSpent = event.timestamp.getTime() - lastEvent.timestamp.getTime();
    }

    this.currentSession.navigationHistory.push(event);
  }

  public trackValidation(fieldName: string, isValid: boolean, errors: string[] = []): void {
    if (!this.currentSession) return;

    const validation: ValidationMetrics = {
      fieldName,
      attempts: 1,
      errors,
      timestamp: new Date()
    };

    this.currentSession.validationAttempts.push(validation);
    
    if (!isValid) {
      this.currentSession.errorCounts[fieldName] = (this.currentSession.errorCounts[fieldName] || 0) + 1;
    }
  }

  public trackPerformance(metric: keyof PerformanceMetrics, value: number | boolean): void {
    if (!this.currentSession) return;

    if (typeof value === 'number') {
      (this.currentSession.performanceMetrics[metric] as number) = value;
    } else {
      (this.currentSession.performanceMetrics[metric] as boolean) = value;
    }
  }

  public trackCustomEvent(type: string, data: any): void {
    if (!this.currentSession) return;

    this.currentSession.customEvents.push({
      type,
      data,
      timestamp: new Date()
    });
  }

  public submitAnalytics(): void {
    if (!this.currentSession) return;

    // End current section if any
    if (this.currentSession.currentSection) {
      this.endSection(this.currentSession.currentSection.name);
    }

    this.calculateCompletionRate();
    this.currentSession.performanceMetrics.totalTimeSpent = 
      performance.now() - this.currentSession.performanceMetrics.formLoadTime;

    // Store analytics in localStorage
    this.analytics.push(this.currentSession);
    if (this.analytics.length > this.MAX_STORED_ENTRIES) {
      this.analytics = this.analytics.slice(-this.MAX_STORED_ENTRIES);
    }

    try {
      localStorage.setItem('formAnalytics', JSON.stringify(this.analytics));
    } catch (error) {
      console.error('Error saving analytics:', error);
    }

    // Log analytics summary
    console.log('Analytics Summary:', {
      sessionId: this.currentSession.sessionId,
      timestamp: this.currentSession.timestamp,
      completionRate: this.currentSession.formCompletionRate,
      totalTimeSpent: this.currentSession.performanceMetrics.totalTimeSpent,
      sectionTimeSpent: this.currentSession.performanceMetrics.sectionTimeSpent,
      errorCount: Object.values(this.currentSession.errorCounts).reduce((a, b) => a + b, 0),
      browserInfo: this.currentSession.browserInfo
    });

    this.currentSession = null;
  }

  private calculateCompletionRate(): void {
    if (!this.currentSession) return;

    const totalFields = Object.keys(this.currentSession.fieldInteractions).length;
    const validFields = Object.values(this.currentSession.fieldInteractions).filter(
      interaction => interaction.validationErrors.length === 0
    ).length;

    this.currentSession.formCompletionRate = totalFields > 0 ? (validFields / totalFields) * 100 : 0;
  }

  public getStoredAnalytics(): FormAnalytics[] {
    return this.analytics;
  }

  public getAnalyticsSummary(): any {
    return {
      totalSessions: this.analytics.length,
      averageCompletionRate: this.calculateAverageCompletionRate(),
      averageTimeSpent: this.calculateAverageTimeSpent(),
      commonErrors: this.getCommonErrors(),
      deviceDistribution: this.getDeviceDistribution(),
      peakUsageHours: this.getPeakUsageHours()
    };
  }

  private calculateAverageCompletionRate(): number {
    return this.analytics.reduce((acc, curr) => acc + curr.formCompletionRate, 0) / this.analytics.length;
  }

  private calculateAverageTimeSpent(): number {
    return this.analytics.reduce((acc, curr) => acc + curr.performanceMetrics.totalTimeSpent, 0) / this.analytics.length;
  }

  private getCommonErrors(): Record<string, number> {
    return this.analytics.reduce((acc, curr) => {
      Object.entries(curr.errorCounts).forEach(([field, count]) => {
        acc[field] = (acc[field] || 0) + count;
      });
      return acc;
    }, {} as Record<string, number>);
  }

  private getDeviceDistribution(): Record<string, number> {
    return this.analytics.reduce((acc, curr) => {
      const deviceType = curr.browserInfo.isMobile ? 'mobile' : 'desktop';
      acc[deviceType] = (acc[deviceType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private getPeakUsageHours(): Record<string, number> {
    return this.analytics.reduce((acc, curr) => {
      const hour = new Date(curr.timestamp).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }
}

export const analyticsService = new AnalyticsService(); 