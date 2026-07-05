import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { makeStyles, useTheme } from '@/theme';
import { formatCurrency } from '@/lib/pricing';
import { PriceBreakdown } from '@/lib/pricing';
import { Txt } from './Txt';

function Line({
  label,
  value,
  hint,
  color,
  strong,
}: {
  label: string;
  value: string;
  hint?: string;
  color?: string;
  strong?: boolean;
}) {
  const { c } = useTheme();
  const styles = useStyles();
  return (
    <View style={styles.line}>
      <View style={styles.lineLeft}>
        <Txt variant={strong ? 'h3' : 'bodyMed'} color={strong ? c.text : color ?? c.textSoft}>
          {label}
        </Txt>
        {hint && (
          <Txt variant="tiny" color={c.textFaint}>
            {hint}
          </Txt>
        )}
      </View>
      <Txt variant={strong ? 'h2' : 'title'} color={strong ? c.aquaSoft : c.text}>
        {value}
      </Txt>
    </View>
  );
}

/**
 * Billing breakdown that mirrors the diagram: base service amount, the 5%
 * platform charge, optional discount and the customer total.
 */
export function PriceSummary({ breakdown, promoLabel }: { breakdown: PriceBreakdown; promoLabel?: string }) {
  const { c } = useTheme();
  const styles = useStyles();
  return (
    <View>
      <Line label="Service amount" value={formatCurrency(breakdown.base)} />
      <Line label="Platform charge" hint="5% booking fee" value={formatCurrency(breakdown.platformFee)} />
      {breakdown.discount > 0 && (
        <Line
          label={promoLabel ?? 'Promo discount'}
          value={`- ${formatCurrency(breakdown.discount)}`}
          color={c.success}
        />
      )}
      <View style={styles.divider} />
      <Line label="Total payable" value={formatCurrency(breakdown.total)} strong />
      <View style={styles.secured}>
        <Ionicons name="lock-closed" size={12} color={c.textMuted} />
        <Txt variant="tiny" color={c.textMuted}>
          Secure escrow payment · released to the wash after service
        </Txt>
      </View>
    </View>
  );
}

const useStyles = makeStyles((c) => ({
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 7,
  },
  lineLeft: {
    gap: 1,
  },
  divider: {
    height: 1,
    backgroundColor: c.hairline,
    marginVertical: 6,
  },
  secured: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
}));
