import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
    Alert,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useExpenses } from "../context/ExpensesContext";
import type { ExpenseItem } from "../types/expense";

const C = {
  cream: "#F4F1EA",
  white: "#FFFFFF",
  navy: "#0F172A",
  muted: "#64748B",
  green: "#10B981",
  line: "#DEDCD6",
  pale: "#DDF3EB",
};
const categories = [
  "Food & Dining",
  "Groceries",
  "Transport",
  "Shopping",
  "Bills & Utilities",
  "Other",
];

function parseCents(value: string): number | null {
  const normalized = value.trim().replace(/[$,\s]/g, "");
  if (!/^\d+(\.\d{0,2})?$/.test(normalized)) return null;
  const [whole, fraction = ""] = normalized.split(".");
  return Number(whole) * 100 + Number((fraction + "00").slice(0, 2));
}
function formatTotal(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function ReviewScreen() {
  const params = useLocalSearchParams<{ imageUri?: string }>();
  const imageUri =
    typeof params.imageUri === "string" ? params.imageUri : undefined;
  const { addExpense } = useExpenses();
  const [merchant, setMerchant] = useState("Cafe Kumbuk");
  const [date, setDate] = useState("Nov 24, 2026");
  const [category, setCategory] = useState("Food & Dining");
  const [items, setItems] = useState<ExpenseItem[]>([
    { id: "1", name: "Avocado toast", price: "14.00" },
    { id: "2", name: "Cappuccino", price: "6.50" },
    { id: "3", name: "Banana pancakes", price: "8.00" },
  ]);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const totalCents = useMemo(
    () => items.reduce((sum, item) => sum + (parseCents(item.price) ?? 0), 0),
    [items],
  );

  const updateItem = (id: string, patch: Partial<ExpenseItem>) =>
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );

  const addItem = () =>
    setItems((current) => [
      ...current,
      { id: `${Date.now()}`, name: "", price: "0.00" },
    ]);
  const deleteItem = (id: string) =>
    setItems((current) => current.filter((item) => item.id !== id));

  const save = () => {
    Keyboard.dismiss();
    if (!merchant.trim()) {
      Alert.alert("Merchant required", "Enter a merchant name before saving.");
      return;
    }
    if (!date.trim()) {
      Alert.alert("Date required", "Enter the receipt date before saving.");
      return;
    }
    if (items.length === 0) {
      Alert.alert("No items", "Add at least one receipt item before saving.");
      return;
    }
    for (const item of items) {
      if (!item.name.trim()) {
        Alert.alert(
          "Item name required",
          "Please enter a name for every item.",
        );
        return;
      }
      const cents = parseCents(item.price);
      if (cents === null || cents < 0) {
        Alert.alert(
          "Invalid price",
          `Enter a valid non-negative price for "${item.name}".`,
        );
        return;
      }
    }
    if (totalCents <= 0) {
      Alert.alert("Invalid total", "The total must be greater than zero.");
      return;
    }
    const now = new Date();
    addExpense({
      id: `expense-${Date.now()}`,
      merchant: merchant.trim(),
      date: date.trim(),
      category,
      items,
      totalCents,
      createdAt: "Just now",
    });
    Alert.alert(
      "Expense saved",
      `${merchant.trim()} · ${formatTotal(totalCents)}`,
      [{ text: "Done", onPress: () => router.replace("/") }],
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.flex}>
          <View style={styles.topBar}>
            <Pressable
              onPress={() => router.back()}
              hitSlop={10}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={22} color={C.navy} />
            </Pressable>
            <Text style={styles.topTitle}>Review Receipt</Text>
            <View style={styles.thumb}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.thumbImage} />
              ) : (
                <MaterialCommunityIcons
                  name="receipt-text"
                  size={32}
                  color="#3C4B45"
                />
              )}
            </View>
          </View>

          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.summaryCard}>
              <Text style={styles.fieldLabel}>Merchant Name</Text>
              <View style={styles.merchantLine}>
                <TextInput
                  value={merchant}
                  onChangeText={setMerchant}
                  style={styles.merchantInput}
                  placeholder="Merchant name"
                  placeholderTextColor="#9AA39F"
                />
                <Ionicons name="pencil-outline" size={18} color="#687875" />
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.metadataRow}>
                <View style={styles.metadataCol}>
                  <Text style={styles.fieldLabel}>Date</Text>
                  <View style={styles.dateLine}>
                    <TextInput
                      value={date}
                      onChangeText={setDate}
                      style={styles.dateInput}
                      placeholder="Receipt date"
                    />
                    <Ionicons
                      name="calendar-outline"
                      size={15}
                      color="#687875"
                    />
                  </View>
                </View>
                <View style={styles.metadataCol}>
                  <Text style={styles.fieldLabel}>Category</Text>
                  <Pressable
                    style={styles.categoryPill}
                    onPress={() => setCategoryOpen(true)}
                  >
                    <Text style={styles.categoryText}>{category}</Text>
                    <Ionicons name="chevron-down" size={13} color="#008B65" />
                  </Pressable>
                </View>
              </View>
            </View>

            <View style={styles.itemsHeading}>
              <Text style={styles.sectionTitle}>Extracted Items</Text>
              <Text style={styles.countText}>{items.length} items</Text>
            </View>

            {items.map((item) => (
              <View key={item.id} style={styles.itemRow}>
                <TextInput
                  value={item.name}
                  onChangeText={(name) => updateItem(item.id, { name })}
                  placeholder="Item name"
                  placeholderTextColor="#A0A8A5"
                  style={styles.itemNameInput}
                  returnKeyType="done"
                />
                <View style={styles.priceBox}>
                  <Text style={styles.dollar}>$</Text>
                  <TextInput
                    value={item.price}
                    onChangeText={(price) => updateItem(item.id, { price })}
                    keyboardType="decimal-pad"
                    style={styles.priceInput}
                    selectTextOnFocus
                  />
                </View>
                <Pressable
                  onPress={() => deleteItem(item.id)}
                  style={styles.deleteButton}
                  hitSlop={8}
                >
                  <Ionicons name="trash-outline" size={19} color="#687875" />
                </Pressable>
              </View>
            ))}

            <Pressable style={styles.addItem} onPress={addItem}>
              <Ionicons name="add" size={20} color="#008B65" />
              <Text style={styles.addItemText}>Add Item</Text>
            </Pressable>
            <View style={styles.helperRow}>
              <Ionicons name="checkmark" size={15} color="#687875" />
              <Text style={styles.helperText}>
                All set? Give your items a quick check.
              </Text>
            </View>
          </ScrollView>

          <View style={styles.bottomSummary}>
            <View style={styles.totalRow}>
              <View>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.totalAmount}>
                  {formatTotal(totalCents)}
                </Text>
              </View>
              <View style={styles.itemCount}>
                <Ionicons name="checkmark" size={14} color="#008B65" />
                <Text style={styles.itemCountText}>{items.length} items</Text>
              </View>
            </View>
            <Pressable style={styles.confirmButton} onPress={save}>
              <Ionicons name="checkmark" size={19} color="#062D25" />
              <Text style={styles.confirmText}>Confirm & Save Expense</Text>
            </Pressable>
          </View>
        </View>

        <Modal
          visible={categoryOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setCategoryOpen(false)}
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setCategoryOpen(false)}
          >
            <View style={styles.categoryModal}>
              <Text style={styles.modalTitle}>Select category</Text>
              {categories.map((option) => (
                <Pressable
                  key={option}
                  style={styles.categoryOption}
                  onPress={() => {
                    setCategory(option);
                    setCategoryOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.categoryOptionText,
                      category === option && styles.selectedOption,
                    ]}
                  >
                    {option}
                  </Text>
                  {category === option && (
                    <Ionicons name="checkmark" color="#008B65" size={18} />
                  )}
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.cream },
  flex: { flex: 1 },
  topBar: {
    height: 70,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  backButton: { width: 30, alignItems: "flex-start" },
  topTitle: { flex: 1, color: C.navy, fontSize: 20, fontWeight: "700" },
  thumb: {
    width: 40,
    height: 48,
    borderRadius: 9,
    backgroundColor: "#E3E8E1",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  thumbImage: { width: "100%", height: "100%" },
  scrollContent: { paddingHorizontal: 24, paddingTop: 7, paddingBottom: 24 },
  summaryCard: {
    backgroundColor: C.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DCDDD9",
    padding: 16,
    marginBottom: 26,
  },
  fieldLabel: { color: "#64736F", fontSize: 11, marginBottom: 7 },
  merchantLine: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 9,
  },
  merchantInput: { flex: 1, color: C.navy, fontSize: 16, padding: 0 },
  summaryDivider: { height: 1, backgroundColor: C.line, marginVertical: 9 },
  metadataRow: { flexDirection: "row", gap: 20 },
  metadataCol: { flex: 1 },
  dateLine: { flexDirection: "row", alignItems: "center", gap: 6 },
  dateInput: { color: C.navy, fontSize: 12, padding: 0, flex: 1 },
  categoryPill: {
    alignSelf: "flex-start",
    backgroundColor: C.pale,
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  categoryText: { color: "#008B65", fontSize: 10, fontWeight: "600" },
  itemsHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sectionTitle: { color: C.navy, fontSize: 18, fontWeight: "700" },
  countText: { color: "#65736F", fontSize: 11 },
  itemRow: {
    minHeight: 58,
    borderBottomWidth: 1,
    borderBottomColor: C.line,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  itemNameInput: {
    flex: 1,
    minWidth: 0,
    color: C.navy,
    fontSize: 13,
    paddingVertical: 8,
  },
  priceBox: {
    width: 78,
    height: 38,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#D9DAD6",
    backgroundColor: C.white,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 9,
  },
  dollar: { color: "#64736F", fontSize: 11, marginRight: 7 },
  priceInput: {
    flex: 1,
    minWidth: 0,
    color: C.navy,
    fontSize: 12,
    textAlign: "right",
    padding: 0,
    fontVariant: ["tabular-nums"],
  },
  deleteButton: { width: 28, alignItems: "flex-end", justifyContent: "center" },
  addItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "flex-start",
    paddingVertical: 13,
  },
  addItemText: { color: "#008B65", fontSize: 13, fontWeight: "600" },
  helperRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 3,
  },
  helperText: { color: "#71807D", fontSize: 10 },
  bottomSummary: {
    backgroundColor: C.white,
    borderTopWidth: 1,
    borderTopColor: "#E1DFD9",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 22,
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 19,
  },
  totalLabel: { color: "#64736F", fontSize: 12, marginBottom: 4 },
  totalAmount: {
    color: C.navy,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "800",
    letterSpacing: -0.7,
    fontVariant: ["tabular-nums"],
  },
  itemCount: { flexDirection: "row", alignItems: "center", gap: 3 },
  itemCountText: { color: "#008B65", fontSize: 11, fontWeight: "600" },
  confirmButton: {
    height: 54,
    borderRadius: 13,
    backgroundColor: C.green,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  confirmText: { color: "#052D25", fontSize: 14, fontWeight: "700" },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.35)",
    justifyContent: "center",
    padding: 28,
  },
  categoryModal: { backgroundColor: C.white, borderRadius: 18, padding: 18 },
  modalTitle: {
    color: C.navy,
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 10,
  },
  categoryOption: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F0EFEC",
  },
  categoryOptionText: { color: C.navy, fontSize: 14 },
  selectedOption: { color: "#008B65", fontWeight: "700" },
});
