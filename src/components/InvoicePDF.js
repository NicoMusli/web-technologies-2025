import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 12,
        fontFamily: 'Helvetica',
        color: '#333',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 20,
    },
    brand: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2563EB',
        textTransform: 'uppercase',
    },
    invoiceTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111',
        textAlign: 'right',
    },
    invoiceMeta: {
        marginTop: 5,
        fontSize: 10,
        color: '#666',
        textAlign: 'right',
    },
    section: {
        marginBottom: 20,
    },
    billTo: {
        marginBottom: 5,
        fontWeight: 'bold',
        fontSize: 10,
        color: '#999',
        textTransform: 'uppercase',
    },
    address: {
        fontSize: 12,
        lineHeight: 1.4,
    },
    table: {
        marginTop: 20,
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        backgroundColor: '#f9fafb',
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingVertical: 10,
        paddingHorizontal: 4,
    },
    colProduct: { width: '50%' },
    colQty: { width: '15%', textAlign: 'center' },
    colPrice: { width: '15%', textAlign: 'right' },
    colTotal: { width: '20%', textAlign: 'right' },

    tableHeaderText: {
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: '#666',
    },

    totalSection: {
        marginTop: 30,
        alignItems: 'flex-end',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '40%',
        marginBottom: 5,
    },
    totalLabel: {
        fontSize: 10,
        color: '#666',
    },
    totalValue: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    grandTotal: {
        borderTopWidth: 2,
        borderTopColor: '#2563EB',
        paddingTop: 10,
        marginTop: 5,
    },
    grandTotalValue: {
        fontSize: 16,
        color: '#2563EB',
        fontWeight: 'bold',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        textAlign: 'center',
        fontSize: 10,
        color: '#999',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 20,
    }
});

const calculateItemPriceWithTax = (item, order) => {
    const netTotal = order.total - (order.shippingCost || 0) - (order.taxAmount || 0);
    const taxRate = netTotal > 0 ? (order.taxAmount / netTotal) : 0;

    return item.price * (1 + taxRate);
};

const InvoicePDF = ({ order }) => {
    const subtotal = order.total - (order.shippingCost || 0) - (order.taxAmount || 0);
    const isBillingSameAsShipping = !order.billingAddress || order.billingAddress === order.shippingAddress;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.brand}>ACSA PRINT</Text>
                        <Text style={{ fontSize: 10, color: '#666', marginTop: 4 }}>Premium Printing Services</Text>
                    </View>
                    <View>
                        <Text style={styles.invoiceTitle}>INVOICE</Text>
                        <Text style={styles.invoiceMeta}>Order ID: #{order.id}</Text>
                        <Text style={styles.invoiceMeta}>Date: {new Date(order.createdAt).toLocaleDateString()}</Text>
                        <Text style={styles.invoiceMeta}>Status: {order.status}</Text>
                    </View>
                </View>

                {/* Customer Info */}
                {isBillingSameAsShipping ? (
                    <View style={styles.section}>
                        <Text style={styles.billTo}>Billing & Shipping To:</Text>
                        <Text style={styles.address}>{order.shippingAddress || 'No Address Provided'}</Text>
                    </View>
                ) : (
                    <View style={[styles.section, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                        <View style={{ width: '45%' }}>
                            <Text style={styles.billTo}>Billing To:</Text>
                            <Text style={styles.address}>
                                {order.billingAddress || 'No Billing Address'}
                            </Text>
                        </View>
                        <View style={{ width: '45%' }}>
                            <Text style={styles.billTo}>Shipping To:</Text>
                            <Text style={styles.address}>
                                {order.shippingAddress || 'No Shipping Address'}
                            </Text>
                        </View>
                    </View>
                )}

                {/* Items Table */}
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.colProduct, styles.tableHeaderText]}>Product / Service</Text>
                        <Text style={[styles.colQty, styles.tableHeaderText]}>Qty</Text>
                        <Text style={[styles.colPrice, styles.tableHeaderText]}>Unit Price</Text>
                        <Text style={[styles.colTotal, styles.tableHeaderText]}>Total</Text>
                    </View>

                    {order.items.map((item, index) => {
                        const unitPriceWithTax = calculateItemPriceWithTax(item, order);
                        const lineTotal = unitPriceWithTax * item.quantity;

                        return (
                            <View key={index} style={styles.tableRow}>
                                <View style={styles.colProduct}>
                                    <Text style={{ fontWeight: 'bold' }}>{item.product.name}</Text>
                                </View>
                                <Text style={styles.colQty}>{item.quantity}</Text>
                                <Text style={styles.colPrice}>€ {unitPriceWithTax.toFixed(2)}</Text>
                                <Text style={styles.colTotal}>€ {lineTotal.toFixed(2)}</Text>
                            </View>
                        );
                    })}
                </View>

                {/* Totals */}
                <View style={styles.totalSection}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Subtotal</Text>
                        <Text style={styles.totalValue}>€ {subtotal.toFixed(2)}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Shipping</Text>
                        <Text style={styles.totalValue}>€ {(order.shippingCost || 0).toFixed(2)}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Tax (20%)</Text>
                        <Text style={styles.totalValue}>€ {(order.taxAmount || 0).toFixed(2)}</Text>
                    </View>
                    <View style={[styles.totalRow, styles.grandTotal]}>
                        <Text style={[styles.totalLabel, { color: '#2563EB', fontWeight: 'bold' }]}>Grand Total</Text>
                        <Text style={styles.grandTotalValue}>€ {order.total.toFixed(2)}</Text>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text>Thank you for choosing ACSA Print!</Text>
                    <Text style={{ marginTop: 4 }}>For questions about this invoice, please contact support.</Text>
                </View>
            </Page>
        </Document>
    );
};

export default InvoicePDF;
