import { StyleSheet } from 'react-native';
import { COLORS } from './colors';

export const CALC_ACCENT = '#2EC4B6';

export const calculatorStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  headerKicker: {
    color: CALC_ACCENT,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginBottom: 6,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: COLORS.textMuted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },
  toolScroller: {
    flexGrow: 0,
  },
  toolChips: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    gap: 8,
  },
  toolChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  toolChipActive: {
    backgroundColor: CALC_ACCENT,
    borderColor: CALC_ACCENT,
  },
  toolChipText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  toolChipTextActive: {
    color: COLORS.background,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 34,
    gap: 16,
  },
  toolTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  toolHint: {
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
  section: {
    gap: 12,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    height: 50,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
    paddingVertical: 0,
  },
  unit: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 8,
  },
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  quickChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quickChipText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  optionChipActive: {
    backgroundColor: CALC_ACCENT,
    borderColor: CALC_ACCENT,
  },
  optionChipText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  optionChipTextActive: {
    color: COLORS.background,
  },
  button: {
    backgroundColor: CALC_ACCENT,
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: COLORS.background,
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  secondaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  secondaryButtonText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
    gap: 10,
  },
  resultTitle: {
    color: CALC_ACCENT,
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  resultLabel: {
    color: COLORS.textMuted,
    fontSize: 13,
    flex: 1,
  },
  resultValue: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
  },
  resultValueHighlight: {
    color: CALC_ACCENT,
    fontSize: 18,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
  alert: {
    flexDirection: 'row',
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  alertInfo: {
    backgroundColor: 'rgba(0, 180, 216, 0.12)',
    borderColor: 'rgba(0, 180, 216, 0.4)',
  },
  alertSuccess: {
    backgroundColor: 'rgba(46, 196, 182, 0.12)',
    borderColor: 'rgba(46, 196, 182, 0.4)',
  },
  alertWarning: {
    backgroundColor: 'rgba(244, 162, 97, 0.12)',
    borderColor: 'rgba(244, 162, 97, 0.4)',
  },
  alertDanger: {
    backgroundColor: 'rgba(230, 57, 70, 0.12)',
    borderColor: 'rgba(230, 57, 70, 0.4)',
  },
  alertText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
  alertTextInfo: {
    color: '#8FE3F5',
  },
  alertTextSuccess: {
    color: '#9BE7DE',
  },
  alertTextWarning: {
    color: '#F7C9A3',
  },
  alertTextDanger: {
    color: '#FF9F8A',
  },
  grid: {
    flexDirection: 'row',
    gap: 12,
  },
  gridItem: {
    flex: 1,
  },
  note: {
    color: COLORS.textMuted,
    fontSize: 11,
    lineHeight: 16,
  },
});
